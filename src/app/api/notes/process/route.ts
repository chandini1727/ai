import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateStudyKit } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { extractTextFromBuffer } from "@/lib/extractor";
// Force rebuild: 2026-02-16T12:15:00

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const title = (formData.get("title") as string) || "Untitled Note";
        const userId = formData.get("userId") as string;

        if (!file || !userId) {
            return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
        }

        // Extract text from file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Pass the file's type to the extractor
        const content = await extractTextFromBuffer(buffer, file.type);

        if (!content || content.length < 20) {
            return NextResponse.json({ error: "Insufficient text content extracted. Neural network requires more data." }, { status: 400 });
        }

        // Generate AI content (Summary, Quiz, Flashcards)
        // Passing req.signal effectively stops processing if user hits "Close" or "Stop"
        const studyKit = await generateStudyKit(content, req.signal);

        // Final safety check before DB write
        if (req.signal.aborted) throw new Error("AbortError");

        // Save to database
        const note = await prisma.note.create({
            data: {
                title,
                content: content.substring(0, 10000), // Store more if needed
                summary: studyKit.summary,
                userId,
                quizzes: {
                    create: {
                        questions: studyKit.quiz,
                    },
                },
                flashcards: {
                    createMany: {
                        data: studyKit.flashcards,
                    },
                },
            },
            include: {
                quizzes: true,
                flashcards: true,
            }
        });

        return NextResponse.json(note);
    } catch (error: any) {
        if (error.message === "AbortError" || error.name === "AbortError") {
            console.log("[API] Note processing aborted by user");
            return new Response(null, { status: 499 }); // Client Closed Request
        }
        console.error("Note processing error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
