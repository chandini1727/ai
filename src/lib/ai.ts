import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStudyKit(content: string) {
    const prompt = `
    Analyze the following academic notes and provide:
    1. A concise summary (max 500 words).
    2. 5 multiple-choice questions for a quiz.
    3. 5 flashcards (front and back).

    Format the output as JSON with the following structure:
    {
      "summary": "...",
      "quiz": [{"question": "...", "options": ["...", "..."], "answer": "..."}],
      "flashcards": [{"front": "...", "back": "..."}]
    }

    Notes:
    ${content}
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
}

export async function analyzeSkillGap(resumeText: string, jobDescription: string) {
    const prompt = `
    Compare the following resume with the job description.
    Identify:
    1. Matching skills.
    2. Missing skills (Gaps).
    3. Recommendation on how to bridge the gaps.
    4. A match percentage (0-100).

    Format as JSON:
    {
      "matchPercentage": 85,
      "matches": ["Skill A", "Skill B"],
      "gaps": ["Skill C", "Skill D"],
      "recommendations": "..."
    }

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
}
