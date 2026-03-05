'use client';

import { motion } from 'framer-motion';

interface TemplateSelectorProps {
    selected: 'modern' | 'minimal' | 'professional';
    onChange: (template: 'modern' | 'minimal' | 'professional') => void;
}

const templates = [
    {
        id: 'modern' as const,
        name: 'Modern',
        description: 'Dark theme with gradient accents',
        gradient: 'from-teal-500 to-cyan-500',
        bgPreview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    },
    {
        id: 'minimal' as const,
        name: 'Minimal',
        description: 'Clean, whitespace-focused',
        gradient: 'from-gray-300 to-gray-200',
        bgPreview: 'bg-white',
    },
    {
        id: 'professional' as const,
        name: 'Professional',
        description: 'Traditional corporate style',
        gradient: 'from-sky-600 to-blue-700',
        bgPreview: 'bg-gradient-to-br from-blue-900 to-blue-800',
    },
];

export default function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
    return (
        <div className="flex gap-3">
            {templates.map((t) => (
                <motion.button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`flex-1 p-3 rounded-2xl border-2 transition-all duration-300 text-left group ${selected === t.id
                            ? 'border-teal-500/50 bg-teal-500/5 shadow-lg shadow-teal-500/10'
                            : 'border-[var(--border)] bg-[var(--bg-card)]/50 hover:border-[var(--border-hover)]'
                        }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={`h-8 rounded-xl bg-gradient-to-r ${t.gradient} mb-2 opacity-${selected === t.id ? '100' : '60'} group-hover:opacity-100 transition-opacity`} />
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.description}</p>
                </motion.button>
            ))}
        </div>
    );
}
