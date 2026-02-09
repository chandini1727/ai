"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2, Globe, FileText, Target, BookOpen, Layers, Database, Cpu, Lock, UserCircle } from "lucide-react";

export default function LandingPage() {
  const techStack = [
    "Next.js 15", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL",
    "OpenAI GPT-4o", "DeepSeek-V3", "Node.js"
  ];

  const teamMembers = [
    { name: "Ch Chandini", role: "322103310047", image: "/images/team/chandini.png" },
    { name: "Ch Mrudula", role: "322103310045", image: "/images/team/mrudula.png" },
    { name: "B Kavaya Sree", role: "322103310013", image: "/images/team/kavya.png" },
    { name: "B.S.V. Subrahmanyam", role: "322103310037", image: "/images/team/subrahmanyam.png" }
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
            <span className="text-xl font-bold tracking-tight text-slate-900 underline decoration-blue-500/30 decoration-4 underline-offset-4">SmartLearn AI</span>
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
      <main className="pt-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Insight Innovators presents</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            SmartLearn & Career AI: <br />
            <span className="text-blue-600 italic">Intelligent Study and Resume Assistant.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            A professional research and career optimization platform. <br />
            Transform your study materials into intelligent knowledge assets
            while aligning your professional profile with global standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl"
            >
              <span>Initialize Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

          </motion.div>
        </div>

        {/* Main USP Grid */}
        <div className="max-w-7xl mx-auto mt-32 px-6 grid md:grid-cols-3 gap-8 pb-10">
          <USPItem
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            title="Document Assistant"
            description="Professional semantic analysis for PDFs and research reports to generate summaries and quizzes."
            badge="New Engine"
          />
          <USPItem
            icon={<Target className="w-6 h-6 text-blue-600" />}
            title="Resume Matrix"
            description="AI-driven career gap analysis to align your academic profile with market-leading standards."
            badge="Real-time"
          />
          <USPItem
            icon={<Lock className="w-6 h-6 text-blue-600" />}
            title="Secure Repository"
            description="Your data is protected by next-gen PQC lattice-based identity systems for total privacy."
            badge="Verified"
          />
        </div>

        {/* Marquee Tech Stack Section */}
        <div className="py-20 overflow-hidden bg-white border-y border-slate-200">
          <div className="mb-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Core Technology Infrastructure</div>
          <div className="relative flex">
            <div className="animate-marquee flex whitespace-nowrap gap-16 items-center">
              {[...techStack, ...techStack].map((tech, idx) => (
                <div key={idx} className="flex items-center space-x-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group">
                  <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-150 transition-transform" />
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">The Human Foundation</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our Core Team: <span className="text-blue-600">Insight Innovators</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all text-center">
                  <div className="w-40 h-40 rounded-3xl mx-auto mb-6 overflow-hidden relative border-4 border-slate-50">
                    <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{member.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center space-x-2.5">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-black tracking-tight uppercase">SmartLearn AI</span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
              Developed with excellence by <span className="text-slate-900">Insight Innovators</span> <br />
              © 2026 Academic Workspace Solutions
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}

function USPItem({ icon, title, description, badge }: { icon: any, title: string, description: string, badge: string }) {
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 transition-all relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 p-4">
        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{badge}</span>
      </div>
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 text-blue-600 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
