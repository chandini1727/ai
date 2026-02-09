"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Target,
    Settings,
    Plus,
    LogOut,
    Bell,
    Search,
    Shield,
    Upload,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    Command,
    ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchNotes(parsedUser.id);
    }, []);

    const fetchNotes = async (userId: string) => {
        try {
            const response = await fetch(`/api/notes?userId=${userId}`);
            const data = await response.json();
            if (Array.isArray(data)) setNotes(data);
        } catch (err) {
            console.error("Failed to fetch notes");
        } finally {
            setIsLoadingNotes(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
            {/* Minimal Header */}
            <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                        <Shield className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">SmartLearn AI<br /><span className="text-[10px] text-blue-600 uppercase tracking-widest font-black">Control Center</span></span>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active NLP Engine</span>
                    </div>
                    <button onClick={handleLogout} className="text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center space-x-2">
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </button>
                    <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
                        <div className="text-right">
                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{user?.name || "Member"}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Academic Profile</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-lg">
                            {user?.name?.[0]?.toUpperCase() || "S"}
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-8 md:p-12 max-w-7xl mx-auto pb-32">
                <NotesTab onProcessed={() => fetchNotes(user.id)} existingNotes={notes} userId={user?.id} />
            </main>
        </div>
    );
}

function NotesTab({ onProcessed, existingNotes, userId }: { onProcessed: () => void, existingNotes: any[], userId?: string }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeNote, setActiveNote] = useState<any>(null);
    const [showModal, setShowModal] = useState<"quiz" | "flashcards" | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name.split('.')[0]);
        formData.append("userId", userId);

        try {
            const res = await fetch("/api/notes/process", { method: "POST", body: formData });
            const data = await res.json();
            setActiveNote(data);
            onProcessed();
        } catch (err) {
            console.error("Processing error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-12">
            {!activeNote ? (
                <div className="space-y-12">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">Document Library</h1>
                            <p className="text-slate-500 font-bold mt-2">Manage and analyze your research repository.</p>
                        </div>
                        <label className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 cursor-pointer hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                            {isProcessing ? <Plus className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span>Import Content</span>
                            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" disabled={isProcessing} />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {existingNotes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => setActiveNote(note)}
                                className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-50 transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-10 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <FileText size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 mb-4 line-clamp-2 leading-tight text-lg">{note.title}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                    <button onClick={() => setActiveNote(null)} className="flex items-center text-[10px] font-black text-blue-600 hover:underline uppercase tracking-[0.2em]">
                        <ArrowLeft className="w-4 h-4 mr-2" /> All Documents
                    </button>

                    <div className="p-12 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Command size={120} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-10 block">Semantic Intelligence Summary</span>
                        <h2 className="text-5xl font-black mb-10 tracking-tight text-slate-900 leading-none">{activeNote.title}</h2>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-4xl">{activeNote.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ModuleAction
                            title="Analytical Quiz"
                            description="Test comprehension using algorithmically generated questions."
                            onClick={() => setShowModal("quiz")}
                            icon={<CheckCircle2 size={24} />}
                        />
                        <ModuleAction
                            title="Recall Deck"
                            description="Optimized flashcards for high-retention memory encoding."
                            onClick={() => setShowModal("flashcards")}
                            icon={<ExternalLink size={24} />}
                        />
                    </div>
                </motion.div>
            )}

            {showModal === "quiz" && <QuizModal note={activeNote} onClose={() => setShowModal(null)} />}
            {showModal === "flashcards" && <FlashcardModal note={activeNote} onClose={() => setShowModal(null)} />}
        </div>
    );
}

function ModuleAction({ title, description, onClick, icon }: { title: string, description: string, onClick: () => void, icon: any }) {
    return (
        <button
            onClick={onClick}
            className="p-10 bg-white border border-slate-200 rounded-3xl text-left hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-50 transition-all group"
        >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">{icon}</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight text-slate-900">{title}</h3>
            <p className="text-slate-500 text-[15px] font-medium mb-10 leading-relaxed">{description}</p>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 flex items-center transition-colors">Initialize Module <ArrowRight className="w-3 h-3 ml-2" /></span>
        </button>
    );
}



function QuizModal({ note, onClose }: { note: any, onClose: () => void }) {
    const questions = note.quizzes?.[0]?.questions || [];
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [done, setDone] = useState(false);

    const handleAnswer = (ansIdx: number) => {
        if (selectedIdx !== null) return;

        setSelectedIdx(ansIdx);
        setShowExplanation(true);

        if (questions[idx].options[ansIdx] === questions[idx].answer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (idx < questions.length - 1) {
            setIdx(i => i + 1);
            setSelectedIdx(null);
            setShowExplanation(false);
        } else {
            setDone(true);
        }
    };

    const currentQuestion = questions[idx];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6 overflow-y-auto">
            <div className="w-full max-w-4xl py-12">
                {!done ? (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center text-[10px] font-black tracking-[0.5em] text-slate-300">
                            <span className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 uppercase">Knowledge Check - {idx + 1} / {questions.length}</span>
                            <button onClick={onClose} className="hover:text-red-500 transition-colors"><X size={32} /></button>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.2] text-slate-900">{currentQuestion?.question}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion?.options.map((opt: string, i: number) => {
                                    const isCorrect = opt === currentQuestion.answer;
                                    const isSelected = i === selectedIdx;

                                    let btnClass = "p-8 bg-white border border-slate-200 rounded-2xl text-left text-lg font-bold transition-all relative group h-full flex flex-col justify-center";

                                    if (selectedIdx !== null) {
                                        if (isCorrect) {
                                            btnClass = "p-8 bg-green-50 border-2 border-green-500 rounded-2xl text-left text-lg font-bold transition-all relative h-full flex flex-col justify-center text-green-700";
                                        } else if (isSelected) {
                                            btnClass = "p-8 bg-red-50 border-2 border-red-500 rounded-2xl text-left text-lg font-bold transition-all relative h-full flex flex-col justify-center text-red-700";
                                        } else {
                                            btnClass = "p-8 bg-white border border-slate-100 rounded-2xl text-left text-lg font-bold opacity-40 transition-all relative h-full flex flex-col justify-center";
                                        }
                                    } else {
                                        btnClass += " hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className={btnClass}
                                        >
                                            <span className={`absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest ${isSelected ? 'opacity-100' : 'opacity-30'}`}>Option {i + 1}</span>
                                            {opt}
                                            {selectedIdx !== null && isCorrect && <CheckCircle2 size={20} className="absolute top-3 right-4 text-green-600" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 bg-slate-50 rounded-3xl border border-slate-200"
                                >
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className={`w-2 h-2 rounded-full ${currentQuestion.options[selectedIdx!] === currentQuestion.answer ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Analysis & Context</h4>
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        {currentQuestion.explanation}
                                    </p>

                                    <button
                                        onClick={nextQuestion}
                                        className="mt-8 flex items-center space-x-3 text-blue-600 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform"
                                    >
                                        <span>{idx < questions.length - 1 ? "Next Challenge" : "Finalize Evaluation"}</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center space-y-12">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-100">
                            <CheckCircle2 size={48} className="text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-slate-900 leading-none">
                                {Math.round((score / questions.length) * 100)}%
                            </h1>
                            <p className="text-blue-600 font-black uppercase tracking-[0.5em] text-xs">Knowledge Retrieval Accuracy</p>
                        </div>
                        <div className="max-w-xs mx-auto text-slate-400 text-xs font-medium leading-relaxed">
                            Your performance has been logged and integrated into your long-term memory profile.
                        </div>
                        <button
                            onClick={onClose}
                            className="px-12 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-black transition-all shadow-xl"
                        >
                            Return to System Hub
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function FlashcardModal({ note, onClose }: { note: any, onClose: () => void }) {
    const cards = note.flashcards || [];
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-2xl text-center">
                <div className="flex justify-between items-center text-[10px] font-black tracking-[0.5em] text-slate-300 mb-24 uppercase">
                    <span className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Active Recall Segment {idx + 1} / {cards.length}</span>
                    <button onClick={onClose} className="hover:text-red-500 transition-colors"><X size={32} /></button>
                </div>

                <div
                    onClick={() => setFlipped(!flipped)}
                    className="h-[500px] w-full perspective-1000 cursor-pointer"
                >
                    <motion.div
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        className="w-full h-full relative preserve-3d"
                        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
                    >
                        <div className="absolute inset-0 backface-hidden border-[3px] border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-20 bg-white">
                            <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.5em] mb-12">Query Module</span>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">{cards[idx]?.front}</h3>
                            <div className="mt-20 text-[9px] text-slate-200 font-black uppercase tracking-[0.4em] flex items-center">
                                <Plus className="w-3 h-3 mr-2 animate-spin" /> Click to Flip
                            </div>
                        </div>
                        <div className="absolute inset-0 backface-hidden rounded-[3rem] flex flex-col items-center justify-center p-20 rotate-y-180 bg-blue-600 text-white shadow-2xl shadow-blue-200">
                            <span className="text-[10px] text-blue-100 font-black uppercase tracking-[0.5em] mb-12">System Output</span>
                            <h3 className="text-3xl font-extrabold leading-relaxed italic opacity-95">{cards[idx]?.back}</h3>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 flex justify-between items-center max-w-xs mx-auto">
                    <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0} className="text-slate-200 hover:text-blue-600 disabled:opacity-0 transition-colors"><ChevronLeft size={64} /></button>
                    <span className="text-xs font-black tracking-[0.5em] text-slate-300 font-mono">{idx + 1} / {cards.length}</span>
                    <button onClick={() => { setIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); }} disabled={idx === cards.length - 1} className="text-slate-200 hover:text-blue-600 disabled:opacity-0 transition-colors"><ChevronRight size={64} /></button>
                </div>
            </div>
        </div>
    )
}
