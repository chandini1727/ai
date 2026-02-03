"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/api/auth/signup", { name, email, password });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration failed.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans px-6">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="mb-10 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h1>
                    <p className="text-slate-500 text-sm font-medium">Join the <span className="font-bold text-blue-600">Quantum AI</span> secure network.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Name</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:bg-white transition-all"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:bg-white transition-all"
                                placeholder="name@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:bg-white transition-all"
                                placeholder="Min. 8 characters"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-bold rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                        <span>{loading ? "Initializing Secure Core..." : "Register Identity"}</span>
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 font-bold">
                        Already registered?
                        <Link href="/login" className="text-blue-600 ml-2 hover:underline">Restore Session</Link>
                    </p>
                </div>
            </div>

            <div className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] flex items-center space-x-3">
                <div className="w-8 h-px bg-slate-200" />
                <span>Quantum AI - Secured Profile Generation</span>
                <div className="w-8 h-px bg-slate-200" />
            </div>
        </div>
    );
}
