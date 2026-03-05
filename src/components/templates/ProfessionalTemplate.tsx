'use client';

import { Resume } from '@/lib/types';

interface TemplateProps {
    resume: Resume;
}

export default function ProfessionalTemplate({ resume }: TemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, sectionOrder } = resume;

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return summary ? (
                    <div key="summary" className="mb-5">
                        <h2 className="text-sm font-bold text-gray-800 border-b-2 border-blue-800 pb-1 mb-2 uppercase">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 text-xs leading-relaxed">{summary}</p>
                    </div>
                ) : null;

            case 'experience':
                return experience.length > 0 ? (
                    <div key="experience" className="mb-5">
                        <h2 className="text-sm font-bold text-gray-800 border-b-2 border-blue-800 pb-1 mb-3 uppercase">
                            Professional Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{exp.role}</h3>
                                        <p className="text-blue-800 text-xs font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0 italic">
                                        {exp.startDate} – {exp.endDate || 'Present'}
                                    </span>
                                </div>
                                {exp.bullets.length > 0 && (
                                    <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i} className="text-gray-700 text-xs">{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'education':
                return education.length > 0 ? (
                    <div key="education" className="mb-5">
                        <h2 className="text-sm font-bold text-gray-800 border-b-2 border-blue-800 pb-1 mb-3 uppercase">
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{edu.degree} in {edu.field}</h3>
                                        <p className="text-blue-800 text-xs font-medium">{edu.school}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0 italic">
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'skills':
                return skills.length > 0 ? (
                    <div key="skills" className="mb-5">
                        <h2 className="text-sm font-bold text-gray-800 border-b-2 border-blue-800 pb-1 mb-2 uppercase">
                            Core Competencies
                        </h2>
                        <div className="grid grid-cols-3 gap-1">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-xs text-gray-700">• {skill}</span>
                            ))}
                        </div>
                    </div>
                ) : null;

            case 'projects':
                return projects.length > 0 ? (
                    <div key="projects" className="mb-5">
                        <h2 className="text-sm font-bold text-gray-800 border-b-2 border-blue-800 pb-1 mb-3 uppercase">
                            Key Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-3">
                                <h3 className="font-bold text-gray-800 text-sm">{project.name}</h3>
                                <p className="text-gray-600 text-xs mt-0.5">{project.description}</p>
                                {project.technologies.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1 italic">
                                        Technologies: {project.technologies.join(', ')}
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
        <div className="bg-white text-gray-900 min-h-[700px] rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 text-white p-6">
                <h1 className="text-2xl font-bold">
                    {personalInfo.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-blue-200">
                    {personalInfo.email && <span>📧 {personalInfo.email}</span>}
                    {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                    {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
                    {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                {sectionOrder.map(renderSection)}
            </div>
        </div>
    );
}
