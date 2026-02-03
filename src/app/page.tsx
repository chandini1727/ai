"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2, Globe, FileText, Target, BookOpen, Layers, Database, Cpu, Lock } from "lucide-react";

export default function LandingPage() {
  const techStack = [
    "Next.js 15", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL",
    "Framer Motion", "ML-KEM-768", "Argon2id", "Keccak SHA-3", "OpenAI GPT-4o",
    "Node.js", "Edge Runtime", "Cloudflare", "Lucide Icons"
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-blue-100">
      {/* Professional Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-500/30 decoration-4 underline-offset-4">StudyFlow</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Sign In</Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Empowering Academic Excellence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Master your studies with <br />
            <span className="text-blue-600">Intelligent Workflows.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            A professional research assistance platform. Optimize document analysis,
            bridge career gaps, and secure your data with next-gen cryptography.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl"
            >
              <span>Initialize Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm" />
              ))}
              <span className="ml-5 text-sm font-bold text-slate-400">Trusted by 2k+ Researchers</span>
            </div>
          </motion.div>
        </div>

        {/* Main USP Grid */}
        <div className="max-w-7xl mx-auto mt-32 px-6 grid md:grid-cols-3 gap-8">
          <USPItem
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            title="Document IQ"
            description="Professional extraction and semantic analysis for PDFs and academic reports."
            badge="New Engine"
          />
          <USPItem
            icon={<Target className="w-6 h-6 text-blue-600" />}
            title="Career Alignment"
            description="AI-driven gap analysis to align your academic profile with market standards."
            badge="Real-time"
          />
          <USPItem
            icon={<Lock className="w-6 h-6 text-blue-600" />}
            title="PQC Protection"
            description="Secured by ML-KEM-768 lattice-based encryption for total privacy."
            badge="Verified"
          />
        </div>
      </main>

      {/* Marquee Tech Stack Section */}
      <div className="py-24 overflow-hidden bg-white border-y border-slate-200">
        <div className="mb-10 text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Our Enterprise Tech Stack</div>
        <div className="relative flex">
          <div className="animate-marquee flex whitespace-nowrap gap-12 items-center">
            {[...techStack, ...techStack].map((tech, idx) => (
              <div key={idx} className="flex items-center space-x-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-2xl font-black text-slate-900 tracking-tighter">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2.5 opacity-40 grayscale">
            <Shield className="w-4 h-4 text-slate-900" />
            <span className="text-sm font-black tracking-tight uppercase">StudyFlow Partners</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 Academic Workspace Solutions</p>
          <div className="flex space-x-6 text-slate-400">
            <Globe className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
            <Database className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
            <Cpu className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function USPItem({ icon, title, description, badge }: { icon: any, title: string, description: string, badge: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3">
        <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{badge}</span>
      </div>
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 tracking-tight text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
