'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Resume } from '@/lib/types';
import { Mail, Sparkles, Copy, Check, Loader2 } from 'lucide-react';

export default function CoverLetterGenerator({ resume }: { resume: Resume }) {
    const [coverLetter, setCoverLetter] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateCoverLetter = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'cover_letter',
                    content: JSON.stringify({
                        name: resume.personalInfo.name,
                        experience: resume.experience.map((e) => `${e.role} at ${e.company}`).join(', '),
                        skills: resume.skills.join(', '),
                        summary: resume.summary,
                    }),
                    context: {
                        role: targetRole,
                        company: targetCompany,
                    },
                }),
            });
            const data = await res.json();
            setCoverLetter(data.suggestion || 'Unable to generate. Please check your OpenAI API key.');
        } catch {
            setCoverLetter('Failed to generate cover letter. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const inputClass =
        'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/50 transition-all';

    return (
        <div className="space-y-6 pl-8">
            {/* Header */}
            <motion.div
                className="editor-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Mail size={20} className="text-rose-400" />
                    AI Cover Letter Generator
                </h2>
                <p className="text-[var(--text-secondary)] text-sm">
                    Generate a tailored cover letter based on your resume and target position.
                </p>
            </motion.div>

            {/* Input fields */}
            <motion.div
                className="editor-section space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                        Target Role
                    </label>
                    <input
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                        Target Company
                    </label>
                    <input
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="e.g., Google"
                        className={inputClass}
                    />
                </div>
                <motion.button
                    onClick={generateCoverLetter}
                    disabled={loading || !targetRole}
                    className="btn-shimmer w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Sparkles size={16} />
                    )}
                    {loading ? 'Generating...' : '✨ Generate Cover Letter'}
                </motion.button>
            </motion.div>

            {/* Output */}
            {coverLetter && (
                <motion.div
                    className="editor-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                            Generated Cover Letter
                        </h3>
                        <motion.button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </motion.button>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)]">
                        <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-[inherit] leading-relaxed">
                            {coverLetter}
                        </pre>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
