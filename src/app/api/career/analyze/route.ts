import { NextRequest, NextResponse } from "next/server";
import { analyzeSkillGap } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { resumeText, jobDescription, userId } = await req.json();

        if (!resumeText || !jobDescription || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const analysis = await analyzeSkillGap(resumeText, jobDescription);

        // Save/Update Resume Analysis
        const resume = await prisma.resume.create({
            data: {
                userId,
                parsedText: resumeText,
                skillGaps: analysis
            }
        });

        return NextResponse.json(resume);
    } catch (error: any) {
        console.error("Career analysis error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
