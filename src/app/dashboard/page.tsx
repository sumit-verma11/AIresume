'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Trash2, Clock, Edit3, Loader2 } from 'lucide-react';
import { Resume } from '@/lib/types';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function DashboardPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await fetch('/api/resumes');
            if (!res.ok) {
                setResumes([]);
                return;
            }
            const data = await res.json();
            setResumes(Array.isArray(data) ? data : []);
        } catch {
            setResumes([]);
        } finally {
            setLoading(false);
        }
    };

    const createResume = async () => {
        setCreating(true);
        try {
            const res = await fetch('/api/resumes', { method: 'POST' });
            const data = await res.json();
            router.push(`/editor/${data._id}`);
        } catch {
            setCreating(false);
        }
    };

    const deleteResume = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this resume?')) return;
        try {
            await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
            setResumes(resumes.filter((r) => r._id !== id));
        } catch {
            /* noop */
        }
    };

    const templateGradients: Record<string, string> = {
        modern: 'from-teal-500 to-cyan-500',
        minimal: 'from-gray-400 to-gray-300',
        professional: 'from-sky-600 to-blue-700',
    };

    return (
        <div className="min-h-screen noise dot-grid relative overflow-hidden">
            {/* Animated orbs */}
            <motion.div
                className="orb orb-teal w-[500px] h-[500px] -top-[150px] -right-[150px]"
                animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="orb orb-coral w-[300px] h-[300px] bottom-[10%] -left-[80px]"
                animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
            />

            {/* Nav */}
            <motion.nav
                className="floating-nav sticky top-0 z-50"
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <motion.div
                            className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            <FileText size={18} className="text-white" />
                        </motion.div>
                        <span className="font-bold text-xl tracking-tight">
                            Resume<span className="gradient-text">AI</span>
                        </span>
                    </Link>
                </div>
            </motion.nav>

            <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                <motion.div
                    className="flex items-center justify-between mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            My <span className="gradient-text">Resumes</span>
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-2">
                            Create, edit, and manage your resumes
                        </p>
                    </div>
                    <motion.button
                        onClick={createResume}
                        disabled={creating}
                        className="btn-shimmer px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/25 flex items-center gap-2 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {creating ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Plus size={18} />
                        )}
                        {creating ? 'Creating...' : 'New Resume'}
                    </motion.button>
                </motion.div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-card p-6 animate-pulse">
                                    <div className="h-36 bg-[var(--bg-card)] rounded-xl mb-4" />
                                    <div className="h-5 bg-[var(--bg-card)] rounded-lg w-2/3 mb-2" />
                                    <div className="h-4 bg-[var(--bg-card)] rounded-lg w-1/3" />
                                </div>
                            ))}
                        </motion.div>
                    ) : resumes.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="text-center py-24"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)] flex items-center justify-center mx-auto mb-8 border border-[var(--border)]"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <FileText size={40} className="text-[var(--text-muted)]" />
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-3">No resumes yet</h2>
                            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                                Create your first AI-powered resume and land your dream job.
                            </p>
                            <motion.button
                                onClick={createResume}
                                disabled={creating}
                                className="btn-shimmer px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/25"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {creating ? 'Creating...' : '✨ Create Your First Resume'}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {resumes.map((resume, i) => (
                                    <motion.div
                                        key={resume._id}
                                        variants={fadeUp}
                                        custom={i}
                                        exit="exit"
                                        layout
                                    >
                                        <Link
                                            href={`/editor/${resume._id}`}
                                            className="block glass-card p-6 group"
                                        >
                                            {/* Template preview */}
                                            <div
                                                className={`h-36 rounded-xl bg-gradient-to-br ${templateGradients[resume.template] || templateGradients.modern
                                                    } mb-4 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity overflow-hidden relative`}
                                            >
                                                <div className="absolute inset-0 dot-grid opacity-30" />
                                                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                                    <p className="text-white font-semibold">
                                                        {resume.personalInfo.name || 'Untitled'}
                                                    </p>
                                                    <p className="text-white/60 text-xs capitalize mt-1">
                                                        {resume.template} template
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-teal-400 transition-colors">
                                                        {resume.title || 'Untitled Resume'}
                                                    </h3>
                                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-[var(--text-muted)]">
                                                        <Clock size={12} />
                                                        <span>
                                                            {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <span className="p-2 rounded-xl hover:bg-teal-500/10 text-[var(--text-muted)] hover:text-teal-400 transition-colors">
                                                        <Edit3 size={14} />
                                                    </span>
                                                    <button
                                                        onClick={(e) => deleteResume(resume._id!, e)}
                                                        className="p-2 rounded-xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
