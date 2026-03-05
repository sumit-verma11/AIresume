'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Palette,
  Download,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Mail,
  Import,
  Bot,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const features = [
  {
    icon: Bot,
    title: 'AI Content Writer',
    description: 'Generate summaries, improve bullets, and get skill suggestions powered by GPT.',
    gradient: 'from-teal-400 to-cyan-400',
    glow: 'shadow-teal-500/20',
  },
  {
    icon: BarChart3,
    title: 'ATS Score Checker',
    description: 'Real-time ATS compatibility scoring with actionable tips to pass filters.',
    gradient: 'from-amber-400 to-orange-400',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: Mail,
    title: 'Cover Letter Generator',
    description: 'AI-crafted cover letters tailored to your resume and target role.',
    gradient: 'from-rose-400 to-pink-400',
    glow: 'shadow-rose-500/20',
  },
  {
    icon: Palette,
    title: '3 Pro Templates',
    description: 'Modern, Minimal, and Professional — all ATS-friendly and beautifully crafted.',
    gradient: 'from-violet-400 to-purple-400',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: Zap,
    title: 'Drag & Drop Sections',
    description: 'Reorder your resume sections with smooth drag-and-drop reordering.',
    gradient: 'from-sky-400 to-blue-400',
    glow: 'shadow-sky-500/20',
  },
  {
    icon: Download,
    title: 'Instant PDF Export',
    description: 'One-click PDF download with pixel-perfect formatting.',
    gradient: 'from-emerald-400 to-teal-400',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: Import,
    title: 'JSON Import/Export',
    description: 'Import existing resume data or export for backup and portability.',
    gradient: 'from-fuchsia-400 to-pink-400',
    glow: 'shadow-fuchsia-500/20',
  },
  {
    icon: Shield,
    title: 'Cloud Storage',
    description: 'Save unlimited resumes with MongoDB cloud persistence.',
    gradient: 'from-lime-400 to-green-400',
    glow: 'shadow-lime-500/20',
  },
  {
    icon: FileText,
    title: 'Live Preview',
    description: 'Split-pane editor with real-time preview that updates as you type.',
    gradient: 'from-orange-400 to-red-400',
    glow: 'shadow-orange-500/20',
  },
];

const stats = [
  { value: '10K+', label: 'Resumes Created' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '3', label: 'Pro Templates' },
  { value: '< 5min', label: 'Avg. Build Time' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen noise dot-grid relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="orb orb-teal w-[600px] h-[600px] -top-[200px] -left-[200px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="orb orb-coral w-[400px] h-[400px] top-[40%] -right-[100px]"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="orb orb-amber w-[300px] h-[300px] bottom-[10%] left-[20%]"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Navigation */}
      <motion.nav
        className="floating-nav sticky top-0 z-50 rounded-none"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FileText size={18} className="text-white" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight">
              Resume<span className="gradient-text">AI</span>
            </span>
          </div>
          <Link href="/dashboard">
            <motion.button
              className="btn-shimmer px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-teal-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-32 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-sm font-medium mb-8"
          >
            <Sparkles size={14} className="animate-pulse-ring" />
            AI-Powered Resume Builder
          </motion.div>

          {/* Title with kinetic typography */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 tracking-tight"
          >
            Craft Resumes
            <br />
            That{' '}
            <motion.span
              className="gradient-text inline-block"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% auto' }}
            >
              Get Hired
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered writing, ATS score checking, and beautiful templates.
            Build a resume that stands out in{' '}
            <span className="text-amber-400 font-medium">under 5 minutes</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <motion.button
                className="btn-shimmer group px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg shadow-2xl shadow-teal-500/30 flex items-center gap-2.5"
                whileHover={{ scale: 1.05, boxShadow: '0 25px 60px rgba(45, 212, 191, 0.35)' }}
                whileTap={{ scale: 0.97 }}
              >
                Start Building
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
            </Link>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener"
              className="px-8 py-4 rounded-2xl border border-[var(--border)] text-[var(--text-secondary)] font-medium hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ⭐ Star on GitHub
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Editor preview mockup */}
        <motion.div
          className="mt-24 relative"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Glow underlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-violet-500/10 blur-[80px] rounded-3xl" />

          <div className="relative border-gradient">
            <div className="bg-[var(--bg-card)] rounded-[20px] p-1.5">
              <div className="bg-[var(--bg-primary)] rounded-2xl p-6 md:p-8">
                {/* Window chrome */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-4 text-xs text-[var(--text-muted)] font-mono">
                    resume-ai — editor
                  </span>
                </div>
                {/* Split pane mockup */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <motion.div className="h-10 bg-[var(--bg-card)] rounded-xl w-3/4" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.div className="h-8 bg-[var(--bg-card)] rounded-lg w-1/2" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.3, repeat: Infinity }} />
                    <div className="space-y-2 mt-6">
                      <motion.div className="h-5 bg-[var(--bg-card)] rounded-lg w-full" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.1, repeat: Infinity }} />
                      <motion.div className="h-5 bg-[var(--bg-card)] rounded-lg w-5/6" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
                      <motion.div className="h-5 bg-[var(--bg-card)] rounded-lg w-4/6" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.6, repeat: Infinity }} />
                    </div>
                    <motion.div className="h-10 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/20 rounded-xl w-2/5 mt-6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} />
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-xl">
                    <div className="h-8 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg w-2/3 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-5/6 mb-5" />
                    <div className="h-5 bg-teal-50 rounded-lg w-1/2 mb-3" />
                    <div className="h-3 bg-gray-50 rounded w-full mb-1.5" />
                    <div className="h-3 bg-gray-50 rounded w-4/5 mb-1.5" />
                    <div className="h-3 bg-gray-50 rounded w-full mb-5" />
                    <div className="flex gap-1.5">
                      <div className="h-5 bg-teal-100 rounded-full w-16" />
                      <div className="h-5 bg-amber-100 rounded-full w-14" />
                      <div className="h-5 bg-rose-100 rounded-full w-18" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 text-center"
            >
              <motion.p
                className="text-3xl md:text-4xl font-bold gradient-text mb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.3 }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 pb-32 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Everything to{' '}
            <span className="gradient-text-warm">Beat the Competition</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg"
          >
            More than just a builder — it&apos;s your personal career coach.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 group cursor-default"
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400 },
              }}
            >
              <motion.div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg ${feature.glow}`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <feature.icon size={22} className="text-white" />
              </motion.div>
              <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500" />
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative px-8 md:px-16 py-20 text-center">
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
              variants={fadeUp}
              custom={0}
            >
              Your Dream Job Starts Here
            </motion.h2>
            <motion.p
              className="text-teal-50 mb-10 max-w-lg mx-auto text-lg"
              variants={fadeUp}
              custom={1}
            >
              Stop sending resumes into the void. Build one that gets past ATS
              filters and impresses hiring managers.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link href="/dashboard">
                <motion.button
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-white text-teal-700 font-bold text-lg hover:bg-gray-50 transition-colors shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started — Free Forever
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-[var(--text-muted)]">
          <p>
            Built with Next.js · React · MongoDB · Tailwind · OpenAI
          </p>
          <p className="mt-2 md:mt-0">
            ResumeAI © {new Date().getFullYear()} — Open Source
          </p>
        </div>
      </footer>
    </div>
  );
}
