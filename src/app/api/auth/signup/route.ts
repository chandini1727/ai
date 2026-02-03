import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPasswordQuantum, generateQuantumKeyPair } from "@/lib/quantum-crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "quantum-secret-key-123";

/**
 * Creates a new professional account and initiates automatic session authorization.
 */
export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "This email is already registered in our system." }, { status: 400 });
        }

        // Securely hash password using Argon2id
        const hashedPassword = await hashPasswordQuantum(password);

        // Generate post-quantum public key identity
        const keys = await generateQuantumKeyPair();

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                quantumPubKey: keys.publicKey
            }
        });

        // 1. GENERATE VERIFICATION TOKEN
        // In a production environment, this would be sent via SMTP/SendGrid
        const verificationToken = Math.random().toString(36).substring(2, 12);
        await prisma.verificationToken.create({
            data: {
                email: user.email,
                token: verificationToken,
                expires: new Date(Date.now() + 3600000) // 1 hour expiry
            }
        });

        console.log(`[SYSTEM] Verification protocol initiated for ${user.email}. Token matches: ${verificationToken}`);

        // 2. AUTOMATIC AUTHORIZATION (Auto-Login)
        // We generate a JWT immediately so the user doesn't have to sign in again after registration
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                authorized: true
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Account Successfully Initialized",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        }, { status: 201 });

    } catch (error: any) {
        console.error("Critical Registration Error:", error);
        return NextResponse.json({ error: "Internal System Error during initialization: " + error.message }, { status: 500 });
    }
}