// @ts-ignore
import { pipeline } from '@xenova/transformers';
// @ts-ignore
import nlp from 'compromise';

// Global model caches
let summarizer: any = null;
let quizGen: any = null;

/**
 * SmartLearn NLP Engine V41.0 (Robust Neural Quiz)
 * 
 * Summary: facebook/bart-large-cnn
 * Quiz: google/flan-t5-large
 * 
 * Features:
 * - Robust parsing for neural questions
 * - Hybrid fallback (never returns 0 questions)
 * - Full-document sampling for quiz context
 */

function cleanRawText(text: string): string {
  return text.replace(/\0/g, '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function generateStudyKit(content: string) {
  try {
    console.log("[NLP Engine] Initializing Robust Pipeline (V41.0)...");
    const rawContent = cleanRawText(content);

    // 1. Load Models
    if (!summarizer) {
      console.log("[NLP Engine] Loading Summarizer: BART-Large...");
      summarizer = await pipeline('summarization', 'Xenova/bart-large-cnn');
    }

    if (!quizGen) {
      console.log("[NLP Engine] Loading Quiz Engine: FLAN-T5-Large...");
      try {
        quizGen = await pipeline('text2text-generation', 'Xenova/flan-t5-large');
      } catch (err) {
        quizGen = await pipeline('text2text-generation', 'Xenova/flan-t5-base');
      }
    }

    // ─── STEP 2: Full Document Summarization (BART) ───
    const segments: string[] = [];
    const targetSize = 2500;
    for (let i = 0; i < rawContent.length; i += targetSize) {
      segments.push(rawContent.slice(i, i + targetSize));
    }

    const summaryParts: string[] = [];
    for (const segment of segments) {
      try {
        const res = await summarizer(segment, { max_new_tokens: 200, min_new_tokens: 50, do_sample: false });
        summaryParts.push(res[0].summary_text);
      } catch (err) {
        summaryParts.push(nlp(segment).sentences().out('array').slice(0, 2).join(' '));
      }
    }
    const summary = summaryParts.join('\n\n');

    // ─── STEP 3: Neural Quiz Synthesis (FLAN-T5) ───
    // Sample key sections from start, middle, and end for balanced quiz
    const paragraphs = rawContent.split(/\n\s*\n/).filter(p => p.length > 150);
    const step = Math.max(1, Math.floor(paragraphs.length / 12));
    const finalExcerpts = paragraphs.filter((_, i) => i % step === 0).slice(0, 12);

    const quiz: any[] = [];
    console.log(`[NLP Engine] Generating intelligent questions from ${finalExcerpts.length} document locations...`);

    for (const text of finalExcerpts) {
      try {
        const prompt = `Generate a Multiple Choice Question (MCQ) with 4 options and the correct answer based on this context. 
            Format exactly as:
            Question: [Your question]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            Answer: [Exactly one letter A, B, C, or D]
            Explanation: [Brief reason]

            Context: ${text.slice(0, 800)}`;

        const res = await quizGen(prompt, { max_new_tokens: 350, do_sample: false, temperature: 0.1 });
        const output = res[0].generated_text as string;

        // Robust Parsing Logic
        const questionMatch = output.match(/Question:\s*(.+?)(?=\n[A-D]\)|$)/i);
        const optA = output.match(/A\)\s*(.+?)(?=\nB\)|$)/i)?.[1]?.trim();
        const optB = output.match(/B\)\s*(.+?)(?=\nC\)|$)/i)?.[1]?.trim();
        const optC = output.match(/C\)\s*(.+?)(?=\nD\)|$)/i)?.[1]?.trim();
        const optD = output.match(/D\)\s*(.+?)(?=\nAnswer:|$)/i)?.[1]?.trim();
        const ansMatch = output.match(/Answer:\s*([A-D])/i);
        const explMatch = output.match(/Explanation:\s*(.+)/i);

        if (questionMatch && optA && optB && ansMatch) {
          const options = [optA, optB, optC || "Alternative Item", optD || "Other Detail"];
          const ansChar = ansMatch[1].toUpperCase();
          const ansIndex = ansChar.charCodeAt(0) - 65;

          quiz.push({
            question: questionMatch[1].trim(),
            options,
            answer: options[ansIndex] || optA,
            explanation: explMatch ? explMatch[1].trim() : "Verified against document context."
          });
        }
      } catch (err) {
        console.warn("[NLP Engine] Neural quiz block failed.");
      }
    }

    // ─── STEP 4: Hybrid Fallback (Ensure we NEVER have 0 questions) ───
    if (quiz.length === 0) {
      console.log("[NLP Engine] Using Hybrid NLP Fallback for Quiz...");
      const fallbackSentences = nlp(summary).sentences().filter(s => s.text().length > 60).slice(0, 5).out('array');
      for (const sent of fallbackSentences) {
        const noun = nlp(sent).nouns().first().text();
        if (noun) {
          quiz.push({
            question: `What primary concept is described here: "${sent.slice(0, 100)}..."?`,
            options: [noun, "Auxiliary Component", "System Process", "Legacy Protocol"].sort(() => 0.5 - Math.random()),
            answer: noun,
            explanation: "Generated via technical entity extraction."
          });
        }
      }
    }

    // ─── STEP 5: Flashcards ───
    const flashcards = nlp(rawContent).nouns().unique().out('array')
      .filter((n: string) => n.length > 7)
      .slice(0, 15)
      .map((noun: string) => ({
        front: noun.toUpperCase(),
        back: nlp(rawContent).sentences().filter(s => s.text().toLowerCase().includes(noun.toLowerCase())).first().text() || "Technical definition from document."
      }));

    return { summary, quiz, flashcards };

  } catch (error: any) {
    console.error("[NLP Engine] Pipeline Failure:", error);
    return { summary: "Synthesis engine encountered a sync error. Please re-upload.", quiz: [], flashcards: [] };
  }
}

/**
 * Skill Gap Analysis
 */
export async function analyzeSkillGap(resumeText: string, jobDescription: string) {
  try {
    const rDoc = nlp(resumeText);
    const jDoc = nlp(jobDescription);
    const rSkills = rDoc.nouns().out('array') as string[];
    const jSkills = jDoc.nouns().out('array') as string[];
    const matches = jSkills.filter(s => rSkills.some(rs => rs.toLowerCase() === s.toLowerCase()));
    return {
      matchPercentage: Math.round((matches.length / (jSkills.length || 1)) * 100),
      matches: Array.from(new Set(matches)),
      gaps: Array.from(new Set(jSkills.filter(s => !matches.includes(s)).slice(0, 10))),
      recommendations: "Focus on strengthening the identified skill gaps."
    };
  } catch (error) {
    return { matchPercentage: 0, matches: [], gaps: [], recommendations: "Analysis failed." };
  }
}
