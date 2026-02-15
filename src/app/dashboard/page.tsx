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
    ExternalLink,
    Trash2,
    Pencil,
    Save,
    Edit3,
    Eye,
    Download,
    FileType,
    FileJson,
    BookOpen,
    Sparkles
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

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
    const [showModal, setShowModal] = useState<"quiz" | "flashcards" | "summary" | null>(null);

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

    const handleDelete = async (noteId: string) => {
        try {
            const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
            if (res.ok) {
                onProcessed(); // Refresh the list
            }
        } catch (err) {
            console.error("Failed to delete note");
        }
    };

    const handleRename = async (noteId: string, newTitle: string) => {
        try {
            const res = await fetch(`/api/notes/${noteId}`, {
                method: "PATCH",
                body: JSON.stringify({ title: newTitle }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                onProcessed(); // Refresh the list
            }
        } catch (err) {
            console.error("Failed to rename note");
        }
    };

    const handleUpdateSummary = async (noteId: string, newSummary: string) => {
        try {
            const res = await fetch(`/api/notes/${noteId}`, {
                method: "PATCH",
                body: JSON.stringify({ summary: newSummary }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                const updated = await res.json();
                setActiveNote(updated);
                onProcessed();
            }
        } catch (err) {
            console.error("Failed to update summary");
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
                            <input type="file" id="note-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" disabled={isProcessing} />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {existingNotes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => setActiveNote(note)}
                                className="relative p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-50 transition-all cursor-pointer group"
                            >
                                <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all bg-white/80 backdrop-blur-sm p-2 rounded-xl">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newTitle = prompt("Enter new title:", note.title);
                                            if (newTitle && newTitle !== note.title) {
                                                handleRename(note.id, newTitle);
                                            }
                                        }}
                                        className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                        title="Rename Document"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Are you sure you want to delete this document and all its study kits?")) {
                                                handleDelete(note.id);
                                            }
                                        }}
                                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                        title="Delete Document"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-10 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <FileText size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 mb-4 line-clamp-2 leading-tight text-lg pr-12">{note.title}</h3>
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

                    <div className="pb-10 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block">Active Neural Map</span>
                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">{activeNote.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary Card */}
                        <div
                            onClick={() => setShowModal("summary")}
                            className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all flex flex-col group cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-10 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-2xl font-black mb-6 tracking-tight text-slate-900">Intelligence Summary</h3>
                            <div className="prose prose-slate prose-sm max-w-none text-slate-500 line-clamp-4 flex-grow overflow-hidden pointer-events-none">
                                <ReactMarkdown>
                                    {activeNote.summary}
                                </ReactMarkdown>
                            </div>
                            <div className="mt-10 pt-6 border-t border-slate-50">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Synthesized by Local Neural Engine</span>
                            </div>
                        </div>

                        {/* Quiz Card */}
                        <ModuleAction
                            title="Analytical Quiz"
                            description="Test comprehension using algorithmically generated questions based on key topics."
                            onClick={() => setShowModal("quiz")}
                            icon={<CheckCircle2 size={24} />}
                        />

                        {/* Flashcards Card */}
                        <ModuleAction
                            title="Recall Deck"
                            description="Optimized flashcards for high-retention memory encoding of important points."
                            onClick={() => setShowModal("flashcards")}
                            icon={<ExternalLink size={24} />}
                        />
                    </div>
                </motion.div>
            )}

            {showModal === "summary" && (
                <SummaryModal
                    note={activeNote}
                    onClose={() => setShowModal(null)}
                    onUpdate={(newSummary: string) => handleUpdateSummary(activeNote.id, newSummary)}
                />
            )}
            {showModal === "quiz" && <QuizModal note={activeNote} onClose={() => setShowModal(null)} />}
            {showModal === "flashcards" && <FlashcardModal note={activeNote} onClose={() => setShowModal(null)} />}
        </div>
    );
}

function SummaryModal({ note, onClose, onUpdate }: { note: any, onClose: () => void, onUpdate: (s: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(note.summary || "");
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleSave = () => {
        onUpdate(text);
        setIsEditing(false);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(text.replace(/[#*]/g, ''), 180);
        doc.setFontSize(20);
        doc.text(note.title, 15, 20);
        doc.setFontSize(11);
        doc.text(splitText, 15, 35);
        doc.save(`${note.title}.pdf`);
    };

    const exportDOCX = async () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ text: note.title, heading: HeadingLevel.HEADING_1 }),
                    ...text.split('\n').map((line: string) => new Paragraph({ text: line.replace(/[#*]/g, '') }))
                ],
            }],
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${note.title}.docx`);
    };

    const exportTXT = () => {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${note.title}.txt`);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-start justify-center p-0 md:p-8 overflow-y-auto">
            <div className="w-full max-w-5xl bg-white min-h-screen md:min-h-0 md:rounded-[3rem] shadow-2xl overflow-hidden relative mb-12">
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-8 py-6 flex flex-col md:flex-row justify-between items-center z-50 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-0.5 block">Deep Intelligence Report</span>
                            <h2 className="text-xl font-black text-slate-900 line-clamp-1">{note.title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="px-5 py-3 bg-slate-900 text-white rounded-xl flex items-center space-x-2 hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <Download size={16} />
                                <span>Export Material</span>
                            </button>

                            {showExportMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                                    <button onClick={exportPDF} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center space-x-3 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold text-[10px]">PDF</div>
                                        <span className="text-[11px] font-bold text-slate-700">Adobe PDF Document</span>
                                    </button>
                                    <button onClick={exportDOCX} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center space-x-3 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-[10px]">DOCX</div>
                                        <span className="text-[11px] font-bold text-slate-700">MS Word Document</span>
                                    </button>
                                    <button onClick={exportTXT} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center space-x-3 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center font-bold text-[10px]">TXT</div>
                                        <span className="text-[11px] font-bold text-slate-700">Plain Text File</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-5 py-3 rounded-xl flex items-center space-x-2 transition-all ${isEditing ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{isEditing ? "Preview" : "Edit Concept"}</span>
                        </button>

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="px-5 py-3 bg-green-600 text-white rounded-xl flex items-center space-x-2 hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                            >
                                <Save size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Save</span>
                            </button>
                        )}
                        <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><X size={20} /></button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-16 relative">
                    <div className="absolute top-16 right-16 opacity-[0.03] pointer-events-none">
                        <BookOpen size={300} />
                    </div>

                    {isEditing ? (
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-[800px] bg-transparent border-none focus:ring-0 text-lg text-slate-700 leading-relaxed font-medium font-mono placeholder-slate-300 resize-none outline-none"
                            placeholder="Add your highlights, points, and bold concepts here..."
                        />
                    ) : (
                        <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-loose scroll-mt-24">
                            <ReactMarkdown
                                components={{
                                    code: ({ node, className, children, ...props }: any) => {
                                        const isBlock = className?.includes('language-') || String(children).includes('\n');
                                        if (isBlock) {
                                            return (
                                                <div className="relative my-4 group">
                                                    <pre className="bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto text-sm leading-relaxed font-mono">
                                                        <code>{String(children).replace(/\n$/, '')}</code>
                                                    </pre>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            );
                                        }
                                        return <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
                                    },
                                    img: ({ node, ...props }) => (
                                        <div className="my-12 flex flex-col items-center">
                                            <img
                                                {...props}
                                                className="rounded-3xl shadow-2xl border border-slate-100 max-h-[600px] object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1024&auto=format&fit=crop`;
                                                }}
                                            />
                                            <span className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Neural Visualization Output</span>
                                        </div>
                                    )
                                }}
                            >
                                {text}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50/50 p-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Control Center V6.5</span>
                    <div className="flex space-x-8">
                        <span>Digital Signature Verified</span>
                        <span>Neural Buffer Active</span>
                    </div>
                </div>
            </div>
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
    const progress = ((idx + 1) / questions.length) * 100;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md overflow-y-auto py-10 px-4 custom-scrollbar">
            <div className="min-h-full flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden relative"
                >
                    {!done ? (
                        <div className="flex flex-col">
                            {/* Linear-style Progress Indicator */}
                            <div className="h-1.5 w-full bg-slate-100 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="absolute h-full bg-blue-600 transition-all duration-700 ease-out"
                                />
                            </div>

                            <div className="p-10 md:p-14 space-y-10">
                                {/* Academic Header */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Question {idx + 1} / {questions.length}
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Knowledge Check</span>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-red-500 hover:rotate-90"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Clean Question Deck */}
                                <div className="space-y-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                                        {currentQuestion?.question}
                                    </h2>

                                    <div className="space-y-4">
                                        {currentQuestion?.options.map((opt: string, i: number) => {
                                            const isCorrect = opt === currentQuestion.answer;
                                            const isSelected = i === selectedIdx;

                                            let styleClass = "w-full p-6 rounded-2xl border-2 flex items-center space-x-5 transition-all duration-300 text-left relative overflow-hidden ";

                                            // Handle color states after selection
                                            if (selectedIdx !== null) {
                                                if (isCorrect) {
                                                    styleClass += "bg-emerald-50 border-emerald-500 text-emerald-900";
                                                } else if (isSelected) {
                                                    styleClass += "bg-rose-50 border-rose-200 text-rose-900";
                                                } else {
                                                    styleClass += "bg-slate-50/50 border-slate-100 text-slate-500";
                                                }
                                            } else {
                                                styleClass += "bg-white border-slate-100 text-slate-700 hover:border-blue-500 hover:bg-blue-50/30 hover:shadow-lg hover:shadow-blue-50 group cursor-pointer";
                                            }

                                            // Determine Index Label (A, B, C...) background
                                            let labelBg = "bg-slate-100 text-slate-400 border-slate-200";
                                            if (selectedIdx !== null) {
                                                if (isCorrect) labelBg = "bg-emerald-600 text-white border-transparent";
                                                else if (isSelected) labelBg = "bg-rose-600 text-white border-transparent";
                                                else labelBg = "bg-slate-200 text-slate-500 border-transparent";
                                            } else {
                                                labelBg = "bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent";
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleAnswer(i)}
                                                    className={styleClass}
                                                    disabled={selectedIdx !== null}
                                                >
                                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2 ${labelBg}`}>
                                                        {String.fromCharCode(65 + i)}
                                                    </span>
                                                    <span className="flex-1 font-bold text-lg leading-snug">{opt}</span>
                                                    {selectedIdx !== null && isCorrect && <CheckCircle2 size={24} className="text-emerald-500 relative z-10" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Refined Feedback Section */}
                                <AnimatePresence>
                                    {showExplanation && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="pt-10 border-t border-slate-100"
                                        >
                                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                                                <div className="flex items-center space-x-3 text-slate-400">
                                                    <Sparkles size={16} />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Synaptic Context</h4>
                                                </div>
                                                <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                                                    "{currentQuestion.explanation}"
                                                </p>

                                                <button
                                                    onClick={nextQuestion}
                                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-slate-200 group"
                                                >
                                                    <span>{idx < questions.length - 1 ? "Next Challenge" : "Finalize Report"}</span>
                                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="p-16 md:p-24 text-center space-y-12">
                            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto border border-blue-100 text-blue-600 shadow-2xl shadow-blue-50/50">
                                <Target size={48} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.8em]">Assessment Cycle Concluded</h3>
                                <div className="text-8xl md:text-9xl font-black tracking-tighter text-slate-900 leading-none">
                                    {Math.round((score / questions.length) * 100)}<span className="text-4xl text-slate-200">%</span>
                                </div>
                                <p className="text-slate-400 font-bold text-lg">Knowledge Retrieval: <span className="text-slate-900">{score} / {questions.length}</span></p>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-16 py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.5em] rounded-2xl hover:bg-black transition-all shadow-2xl shadow-slate-200"
                            >
                                Re-enter Repository
                            </button>
                        </div>
                    )}
                </motion.div>
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
