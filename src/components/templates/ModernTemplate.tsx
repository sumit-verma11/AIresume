'use client';

import { Resume } from '@/lib/types';

interface TemplateProps {
    resume: Resume;
}

export default function ModernTemplate({ resume }: TemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, sectionOrder } = resume;

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return summary ? (
                    <div key="summary" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2 border-b border-indigo-400/30 pb-1">
                            Professional Summary
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
                    </div>
                ) : null;

            case 'experience':
                return experience.length > 0 ? (
                    <div key="experience" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3 border-b border-indigo-400/30 pb-1">
                            Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">{exp.role}</h3>
                                        <p className="text-indigo-300 text-xs">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0">
                                        {exp.startDate} — {exp.endDate || 'Present'}
                                    </span>
                                </div>
                                {exp.bullets.length > 0 && (
                                    <ul className="mt-1.5 space-y-1">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
                                                <span className="text-indigo-400 mt-1">▹</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'education':
                return education.length > 0 ? (
                    <div key="education" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3 border-b border-indigo-400/30 pb-1">
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">{edu.degree} in {edu.field}</h3>
                                        <p className="text-indigo-300 text-xs">{edu.school}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0">
                                        {edu.startDate} — {edu.endDate || 'Present'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'skills':
                return skills.length > 0 ? (
                    <div key="skills" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2 border-b border-indigo-400/30 pb-1">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null;

            case 'projects':
                return projects.length > 0 ? (
                    <div key="projects" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3 border-b border-indigo-400/30 pb-1">
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white text-sm">{project.name}</h3>
                                    {project.url && (
                                        <span className="text-xs text-indigo-400">↗</span>
                                    )}
                                </div>
                                <p className="text-gray-300 text-xs mt-0.5">{project.description}</p>
                                {project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-[700px] rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h1 className="text-2xl font-bold">
                    {personalInfo.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-indigo-100">
                    {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                    {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
                    {personalInfo.linkedin && <span>in {personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                {sectionOrder.map(renderSection)}
            </div>
        </div>
    );
}
