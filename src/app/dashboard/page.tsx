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
    const [activeTab, setActiveTab] = useState("overview");
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
        <div className="flex h-screen bg-[#f8fafc] text-[#1e293b] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col z-20">
                <div className="p-8 flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                        <Shield className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">StudyFlow<br /><span className="text-[10px] text-blue-600 uppercase tracking-widest font-black">Dashboard</span></span>
                </div>

                <nav className="flex-grow px-4 mt-6 space-y-1.5">
                    <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                    <SidebarItem icon={<FileText size={18} />} label="Document Library" active={activeTab === "notes"} onClick={() => setActiveTab("notes")} />
                    <SidebarItem icon={<Target size={18} />} label="Career Matrix" active={activeTab === "career"} onClick={() => setActiveTab("career")} />
                    <SidebarItem icon={<Settings size={18} />} label="Security Settings" active={activeTab === "training"} onClick={() => setActiveTab("training")} />
                </nav>

                <div className="p-6 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut size={16} />
                        <span>Terminate</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto relative">
                <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Search repositories..."
                            className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-600"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Quantum Secured</span>
                        </div>
                        <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900 leading-none mb-1">{user?.name || "Member"}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enterprise Plan</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-lg">
                                {user?.name?.[0]?.toUpperCase() || "S"}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-12 max-w-7xl mx-auto pb-32">
                    {activeTab === "overview" && <OverviewTab notes={notes} isLoading={isLoadingNotes} />}
                    {activeTab === "notes" && <NotesTab onProcessed={() => fetchNotes(user.id)} existingNotes={notes} userId={user?.id} />}
                    {activeTab === "career" && <CareerTab userId={user?.id} />}
                    {activeTab === "training" && <div className="py-20 text-center text-slate-400 font-bold italic">Module under encryption. Contact admin.</div>}
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all text-sm font-bold ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
        >
            <span className={active ? "text-white" : "text-slate-300 group-hover:text-blue-400"}>{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function OverviewTab({ notes, isLoading }: { notes: any[], isLoading: boolean }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500 font-bold">Your academic intelligence dashboard is ready.</p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
                    System Hub: <span className="text-blue-600 ml-1">Connected</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <OverviewStat title="Total Library" value={notes.length.toString()} icon={<FileText size={20} />} />
                <OverviewStat title="Semantic Score" value="94%" icon={<Command size={20} />} />
                <OverviewStat title="Encryption" value="Active" icon={<Shield size={20} />} />
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Documentation</h3>
                    <button className="text-[10px] font-black text-blue-600 hover:underline tracking-widest uppercase">View Archive</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="py-20 flex justify-center"><Plus className="w-6 h-6 animate-spin text-slate-200" /></div>
                    ) : notes.length === 0 ? (
                        <div className="py-32 text-center text-slate-400 font-bold italic text-sm">
                            No data segments found. Use the Library tab to import materials.
                        </div>
                    ) : (
                        notes.slice(0, 5).map((note, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 hover:bg-blue-50/30 transition-all cursor-pointer group">
                                <div className="flex items-center space-x-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-slate-900 text-[15px]">{note.title}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">{new Date(note.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-blue-600 transition-colors" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function OverviewStat({ title, value, icon }: { title: string, value: string, icon: any }) {
    return (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">{icon}</div>
                <span className="text-3xl font-black tracking-tighter text-slate-900">{value}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
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

function CareerTab({ userId }: { userId?: string }) {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<any>(null);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/extract", { method: "POST", body: formData });
            const data = await res.json();
            setResumeText(data.text);
            setStep(2);
        } catch (err) {
            console.error("Extraction failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const startAnalysis = async () => {
        if (!jobDescription || !userId) return;
        setIsProcessing(true);
        try {
            const res = await fetch("/api/career/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText,
                    jobDescription,
                    userId
                })
            });
            const data = await res.json();
            setResult(data.skillGaps);
            setStep(3);
        } catch (err) {
            console.error("Analysis failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Market Matrix</h1>
                <p className="text-slate-500 font-bold text-lg mt-2">Align your professional profile with industry standards.</p>
            </div>

            {step === 1 && (
                <div className="p-20 bg-white border border-slate-200 rounded-[3rem] text-center shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-blue-100">
                        <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-slate-900">Upload Professional Profile</h2>
                    <p className="text-slate-500 mb-12 max-w-sm mx-auto font-medium">We'll extract your skills and experience for comparative analysis.</p>
                    <label className="inline-block px-14 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl cursor-pointer hover:bg-slate-800 transition-all shadow-xl">
                        {isProcessing ? "Extracting Data..." : "Select Document"}
                        <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.docx" disabled={isProcessing} />
                    </label>
                </div>
            )}

            {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-12 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                    <h2 className="text-[10px] font-black mb-8 tracking-[0.5em] text-blue-600 uppercase">Target Requirements</h2>
                    <textarea
                        className="w-full h-80 bg-slate-50 border border-slate-200 rounded-2xl p-10 text-slate-900 text-sm mb-10 font-medium leading-relaxed focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                        placeholder="Paste the target job description details here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <button
                        onClick={startAnalysis}
                        className="w-full py-6 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                    >
                        {isProcessing ? "Running Comparative Engine..." : "Execute Alignment Metric"}
                    </button>
                </motion.div>
            )}

            {step === 3 && result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                    <div className="p-16 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                        <div className="flex justify-between items-start mb-20 border-b border-slate-100 pb-16">
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter uppercase whitespace-pre-wrap leading-[0.85] text-slate-900">ALIGNMENT<br />SCORE</h1>
                                <p className="text-blue-600 font-extrabold text-xs mt-6 tracking-[0.4em] uppercase">Confidential System Metric</p>
                            </div>
                            <div className="text-[140px] font-black leading-none tracking-tighter text-blue-600">
                                {result.matchPercentage}<span className="text-[50px] font-black ml-1">%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                            <div className="space-y-10">
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-10 pb-4 border-b border-slate-50">Verified proficiencies</h4>
                                <div className="flex flex-wrap gap-3">
                                    {result.matches?.map((m: any) => (
                                        <span key={m} className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs font-black uppercase tracking-wider">{m}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-10">
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-10 pb-4 border-b border-slate-50">Strategic Gaps</h4>
                                <div className="flex flex-wrap gap-3">
                                    {result.gaps?.map((g: any) => (
                                        <span key={g} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider">{g}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-24 pt-20 border-t border-slate-100">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-12">Growth Recommendation</h4>
                            <div className="bg-blue-50/50 p-10 rounded-[2.5rem] border-l-8 border-blue-600">
                                <p className="text-slate-800 text-2xl leading-relaxed font-extrabold italic">"{result.recommendations}"</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function QuizModal({ note, onClose }: { note: any, onClose: () => void }) {
    const questions = note.quizzes?.[0]?.questions || [];
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const handleAnswer = (ansIdx: number) => {
        if (questions[idx].options[ansIdx] === questions[idx].answer) setScore(s => s + 1);
        if (idx < questions.length - 1) setIdx(i => i + 1);
        else setDone(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-4xl">
                {!done ? (
                    <div className="space-y-24">
                        <div className="flex justify-between items-center text-[10px] font-black tracking-[0.5em] text-slate-300">
                            <span className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">EVALUATION METRIC - {idx + 1} / {questions.length}</span>
                            <button onClick={onClose} className="hover:text-red-500 transition-colors"><X size={32} /></button>
                        </div>
                        <h2 className="text-6xl font-black tracking-tight leading-[1.1] text-slate-900">{questions[idx]?.question}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {questions[idx]?.options.map((opt: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    className="p-10 bg-white border border-slate-200 rounded-[2rem] text-left text-xl font-black hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-50 transition-all font-sans relative group"
                                >
                                    <span className="absolute top-4 left-4 text-[10px] text-slate-200 group-hover:text-blue-500 transition-colors">OPTION_0{i + 1}</span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-16">
                        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner border border-blue-100">
                            <CheckCircle2 size={64} className="text-blue-600" />
                        </div>
                        <h1 className="text-[160px] font-black tracking-tighter leading-none text-slate-900">{(score / questions.length) * 100}%</h1>
                        <p className="text-blue-600 font-extrabold uppercase tracking-[0.8em] text-xs">RETENTION ACCURACY VERIFIED</p>
                        <button onClick={onClose} className="px-20 py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-black transition-all shadow-2xl">RETURN TO SYSTEM HUB</button>
                    </div>
                )}
            </div>
        </div>
    )
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
