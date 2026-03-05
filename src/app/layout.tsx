import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ResumeAI — AI-Powered Resume Builder',
  description:
    'Build stunning, professional resumes in minutes with AI-powered suggestions, beautiful templates, and instant PDF export.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
