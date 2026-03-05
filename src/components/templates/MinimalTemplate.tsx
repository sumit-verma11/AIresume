'use client';

import { Resume } from '@/lib/types';

interface TemplateProps {
    resume: Resume;
}

export default function MinimalTemplate({ resume }: TemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, sectionOrder } = resume;

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return summary ? (
                    <div key="summary" className="mb-8">
                        <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
                    </div>
                ) : null;

            case 'experience':
                return experience.length > 0 ? (
                    <div key="experience" className="mb-8">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                            Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-5">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-medium text-gray-900 text-sm">
                                        {exp.role} <span className="text-gray-400 font-normal">at</span> {exp.company}
                                    </h3>
                                    <span className="text-xs text-gray-400 shrink-0 ml-4">
                                        {exp.startDate} – {exp.endDate || 'Present'}
                                    </span>
                                </div>
                                {exp.bullets.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i} className="text-gray-600 text-xs pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">
                                                {bullet}
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
                    <div key="education" className="mb-8">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-medium text-gray-900 text-sm">
                                        {edu.degree} in {edu.field}
                                    </h3>
                                    <span className="text-xs text-gray-400 shrink-0 ml-4">
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs">{edu.school}</p>
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'skills':
                return skills.length > 0 ? (
                    <div key="skills" className="mb-8">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                            Skills
                        </h2>
                        <p className="text-gray-600 text-sm">{skills.join(' · ')}</p>
                    </div>
                ) : null;

            case 'projects':
                return projects.length > 0 ? (
                    <div key="projects" className="mb-8">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-3">
                                <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
                                <p className="text-gray-500 text-xs mt-0.5">{project.description}</p>
                                {project.technologies.length > 0 && (
                                    <p className="text-gray-400 text-xs mt-1">
                                        {project.technologies.join(' · ')}
                                    </p>
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
        <div className="bg-white text-gray-900 min-h-[700px] p-8 rounded-lg shadow-lg">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-2xl font-light tracking-wide text-gray-900">
                    {personalInfo.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-gray-400">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.website && <span>{personalInfo.website}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Body */}
            {sectionOrder.map(renderSection)}
        </div>
    );
}
