'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Resume } from '@/lib/types';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    BarChart3,
    Target,
} from 'lucide-react';

interface ATSCheck {
    label: string;
    passed: boolean;
    tip: string;
    weight: number;
}

export default function ATSScorePanel({ resume }: { resume: Resume }) {
    const checks = useMemo<ATSCheck[]>(() => {
        const p = resume.personalInfo;
        return [
            {
                label: 'Contact information present',
                passed: !!(p.name && p.email && p.phone),
                tip: 'Include your full name, email, and phone number.',
                weight: 15,
            },
            {
                label: 'Professional summary included',
                passed: resume.summary.length > 30,
                tip: 'Add a 2-3 sentence professional summary highlighting your key strengths.',
                weight: 12,
            },
            {
                label: 'Summary length optimal (50-300 chars)',
                passed: resume.summary.length >= 50 && resume.summary.length <= 300,
                tip: 'Keep your summary between 50-300 characters for optimal ATS parsing.',
                weight: 5,
            },
            {
                label: 'At least one experience entry',
                passed: resume.experience.length > 0,
                tip: 'Add at least one work experience entry.',
                weight: 15,
            },
            {
                label: 'Experience has quantified bullets',
                passed: resume.experience.some((e) =>
                    e.bullets.some((b) => /\d+%?/.test(b))
                ),
                tip: 'Include numbers and metrics in your bullet points (e.g., "Increased sales by 25%").',
                weight: 10,
            },
            {
                label: 'Action verbs in bullet points',
                passed: resume.experience.some((e) =>
                    e.bullets.some((b) =>
                        /^(Led|Built|Developed|Created|Managed|Designed|Implemented|Improved|Delivered|Increased|Reduced|Optimized|Launched|Established|Collaborated|Automated|Streamlined|Analyzed)/i.test(
                            b.trim()
                        )
                    )
                ),
                tip: 'Start bullet points with strong action verbs (Led, Built, Improved, etc.).',
                weight: 8,
            },
            {
                label: 'Education section filled',
                passed: resume.education.length > 0,
                tip: 'Add your education details.',
                weight: 10,
            },
            {
                label: 'Skills section has 5+ skills',
                passed: resume.skills.length >= 5,
                tip: 'List at least 5 relevant skills. Use keywords from job descriptions.',
                weight: 12,
            },
            {
                label: 'No empty sections in order',
                passed: !resume.sectionOrder.some((s) => {
                    if (s === 'summary') return !resume.summary;
                    if (s === 'experience') return resume.experience.length === 0;
                    if (s === 'education') return resume.education.length === 0;
                    if (s === 'skills') return resume.skills.length === 0;
                    if (s === 'projects') return resume.projects.length === 0;
                    return false;
                }),
                tip: 'Fill all sections or remove empty ones from the section order.',
                weight: 5,
            },
            {
                label: 'Resume has projects listed',
                passed: resume.projects.length > 0,
                tip: 'Showcase relevant projects to demonstrate hands-on experience.',
                weight: 8,
            },
        ];
    }, [resume]);

    const score = useMemo(() => {
        const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
        const earned = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
        return Math.round((earned / totalWeight) * 100);
    }, [checks]);

    const passedCount = checks.filter((c) => c.passed).length;
    const scoreColor =
        score >= 80
            ? 'text-emerald-400'
            : score >= 60
                ? 'text-amber-400'
                : 'text-red-400';
    const scoreGradient =
        score >= 80
            ? 'from-emerald-500 to-teal-500'
            : score >= 60
                ? 'from-amber-500 to-orange-500'
                : 'from-red-500 to-rose-500';

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="space-y-6 pl-8">
            {/* Score circle */}
            <motion.div
                className="editor-section flex items-center gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="relative">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            transform="rotate(-90 60 60)"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" className={`${scoreGradient.includes('emerald') ? '[stop-color:#10b981]' : scoreGradient.includes('amber') ? '[stop-color:#f59e0b]' : '[stop-color:#ef4444]'}`} stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} />
                                <stop offset="100%" className="" stopColor={score >= 80 ? '#14b8a6' : score >= 60 ? '#f97316' : '#f43f5e'} />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                            className={`text-3xl font-bold ${scoreColor}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {score}
                        </motion.span>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BarChart3 size={20} className="text-amber-400" />
                        ATS Compatibility Score
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                        {passedCount}/{checks.length} checks passed
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {score >= 80
                            ? '🎉 Your resume is highly ATS-compatible!'
                            : score >= 60
                                ? '⚠️ Good start, but some improvements needed.'
                                : '🔴 Needs significant improvements to pass ATS filters.'}
                    </p>
                </div>
            </motion.div>

            {/* Checks list */}
            <div className="space-y-2">
                {checks.map((check, i) => (
                    <motion.div
                        key={check.label}
                        className="editor-section !p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.3 }}
                    >
                        <div className="flex items-start gap-3">
                            {check.passed ? (
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                                <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${check.passed ? 'text-[var(--text-primary)]' : 'text-red-300'}`}>
                                    {check.label}
                                </p>
                                {!check.passed && (
                                    <div className="flex items-start gap-1.5 mt-1.5">
                                        <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-300/80">{check.tip}</p>
                                    </div>
                                )}
                            </div>
                            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] shrink-0">
                                <Target size={10} />
                                {check.weight}pts
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
