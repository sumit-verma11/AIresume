'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Resume } from '@/lib/types';
import ResumeEditor from '@/components/ResumeEditor';
import ResumePreview from '@/components/ResumePreview';
import TemplateSelector from '@/components/TemplateSelector';
import { downloadPDF } from '@/components/PDFExport';
import ATSScorePanel from '@/components/ATSScorePanel';
import CoverLetterGenerator from '@/components/CoverLetterGenerator';
import {
    FileText,
    Download,
    Save,
    ArrowLeft,
    Check,
    Loader2,
    BarChart3,
    Mail,
    Upload,
    FileDown,
    Eye,
    PenTool,
} from 'lucide-react';

export default function EditorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [resume, setResume] = useState<Resume | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activePanel, setActivePanel] = useState<'editor' | 'ats' | 'cover'>('editor');
    const [showPreview, setShowPreview] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await fetch(`/api/resumes/${id}`);
                if (!res.ok) throw new Error('Not found');
                const data = await res.json();
                setResume(data);
            } catch {
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id, router]);

    const saveResume = useCallback(async () => {
        if (!resume) return;
        setSaving(true);
        try {
            await fetch(`/api/resumes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resume),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setSaving(false);
        }
    }, [resume, id]);

    // Auto-save
    useEffect(() => {
        if (!resume) return;
        const t = setInterval(saveResume, 30000);
        return () => clearInterval(t);
    }, [resume, saveResume]);

    // Ctrl+S
    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                saveResume();
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [saveResume]);

    // JSON import
    const handleJSONImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const text = await file.text();
            try {
                const data = JSON.parse(text);
                if (data.personalInfo && data.sectionOrder) {
                    setResume((prev) => prev ? { ...prev, ...data, _id: prev._id } : prev);
                }
            } catch {
                alert('Invalid JSON file');
            }
        };
        input.click();
    };

    // JSON export
    const handleJSONExport = () => {
        if (!resume) return;
        const { _id, ...data } = resume;
        void _id;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.title || 'resume'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Word count
    const getWordCount = (): number => {
        if (!resume) return 0;
        const text = [
            resume.summary,
            ...resume.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
            ...resume.education.map((e) => `${e.degree} ${e.field} ${e.school}`),
            ...resume.skills,
            ...resume.projects.map((p) => `${p.name} ${p.description}`),
        ].join(' ');
        return text.split(/\s+/).filter(Boolean).length;
    };

    if (loading || !resume) {
        return (
            <div className="min-h-screen flex items-center justify-center noise dot-grid">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader2 size={36} className="animate-spin text-teal-500 mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Loading resume...</p>
                </motion.div>
            </div>
        );
    }

    const wordCount = getWordCount();

    return (
        <div className="min-h-screen flex flex-col noise">
            {/* Top bar */}
            <motion.header
                className="floating-nav sticky top-0 z-50 border-b border-[var(--border)]"
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <motion.div
                                className="p-2 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                whileHover={{ x: -3 }}
                            >
                                <ArrowLeft size={18} />
                            </motion.div>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                                <FileText size={14} className="text-white" />
                            </div>
                            <input
                                value={resume.title}
                                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                                className="bg-transparent border-none outline-none font-semibold text-sm w-32 focus:w-48 transition-all text-[var(--text-primary)]"
                                placeholder="Untitled Resume"
                            />
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]">
                                {wordCount} words
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Panel tabs */}
                        <div className="flex items-center bg-[var(--bg-card)] rounded-xl p-1 mr-2 border border-[var(--border)]">
                            <button
                                onClick={() => setActivePanel('editor')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePanel === 'editor'
                                    ? 'bg-teal-500/15 text-teal-400'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                            >
                                <PenTool size={12} />
                                Editor
                            </button>
                            <button
                                onClick={() => setActivePanel('ats')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePanel === 'ats'
                                    ? 'bg-amber-500/15 text-amber-400'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                            >
                                <BarChart3 size={12} />
                                ATS Score
                            </button>
                            <button
                                onClick={() => setActivePanel('cover')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePanel === 'cover'
                                    ? 'bg-rose-500/15 text-rose-400'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                            >
                                <Mail size={12} />
                                Cover Letter
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`p-2 rounded-xl text-xs transition-colors ${showPreview
                                ? 'bg-[var(--bg-card)] text-teal-400'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                }`}
                            title="Toggle preview"
                        >
                            <Eye size={16} />
                        </button>

                        <button onClick={handleJSONImport} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors" title="Import JSON">
                            <Upload size={16} />
                        </button>
                        <button onClick={handleJSONExport} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors" title="Export JSON">
                            <FileDown size={16} />
                        </button>

                        <motion.button
                            onClick={saveResume}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {saved ? (
                                <Check size={14} className="text-emerald-400" />
                            ) : saving ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Save size={14} />
                            )}
                            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
                        </motion.button>
                        <motion.button
                            onClick={() => downloadPDF(resume, resume.title)}
                            className="btn-shimmer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg shadow-teal-500/20"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Download size={14} />
                            Export PDF
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Template selector */}
            <motion.div
                className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <TemplateSelector
                    selected={resume.template}
                    onChange={(template) => setResume({ ...resume, template })}
                />
            </motion.div>

            {/* Main area */}
            <main className={`flex-1 grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} divide-x divide-[var(--border)]`}>
                {/* Left panel */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                    <AnimatePresence mode="wait">
                        {activePanel === 'editor' && (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ResumeEditor resume={resume} onChange={setResume} />
                            </motion.div>
                        )}
                        {activePanel === 'ats' && (
                            <motion.div
                                key="ats"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ATSScorePanel resume={resume} />
                            </motion.div>
                        )}
                        {activePanel === 'cover' && (
                            <motion.div
                                key="cover"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CoverLetterGenerator resume={resume} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Preview */}
                {showPreview && (
                    <motion.div
                        className="overflow-y-auto p-6 bg-[var(--bg-secondary)]"
                        style={{ maxHeight: 'calc(100vh - 140px)' }}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ResumePreview resume={resume} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
