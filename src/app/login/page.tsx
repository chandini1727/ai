"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/api/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed.");
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
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Sign In</h1>
                    <p className="text-slate-500 text-sm font-medium">Access your <span className="font-bold text-blue-600">Quantum AI</span> account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:bg-white transition-all shadow-inner"
                                placeholder="name@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:bg-white transition-all shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-bold rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50"
                    >
                        <span>{loading ? "Authenticating Tunnel..." : "Restore Session"}</span>
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 font-bold">
                        New entity?
                        <Link href="/signup" className="text-blue-600 ml-2 hover:underline">Register Identity</Link>
                    </p>
                </div>
            </div>

            <div className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] flex items-center space-x-3">
                <div className="w-8 h-px bg-slate-200" />
                <span>Quantum AI - Post-Quantum Handshake</span>
                <div className="w-8 h-px bg-slate-200" />
            </div>
        </div>
    );
}
