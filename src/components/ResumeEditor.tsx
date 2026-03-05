'use client';

import { useState } from 'react';
import { Resume, Experience, Education, Project } from '@/lib/types';
import { Sparkles, Plus, Trash2, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ResumeEditorProps {
    resume: Resume;
    onChange: (resume: Resume) => void;
}

function SortableSection({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div
                {...attributes}
                {...listeners}
                className="absolute -left-8 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300"
            >
                <GripVertical size={16} />
            </div>
            {children}
        </div>
    );
}

function AIButton({
    onClick,
    loading,
    label,
}: {
    onClick: () => void;
    loading: boolean;
    label?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-500 hover:to-cyan-500 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
        >
            <Sparkles size={12} className={loading ? 'animate-spin' : ''} />
            {label || '✨ Improve with AI'}
        </button>
    );
}

export default function ResumeEditor({ resume, onChange }: ResumeEditorProps) {
    const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const updateField = <K extends keyof Resume>(key: K, value: Resume[K]) => {
        onChange({ ...resume, [key]: value });
    };

    const updatePersonalInfo = (field: string, value: string) => {
        onChange({
            ...resume,
            personalInfo: { ...resume.personalInfo, [field]: value },
        });
    };

    const requestAI = async (
        type: string,
        content: string,
        context?: string | Record<string, string>
    ): Promise<string> => {
        const res = await fetch('/api/ai/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, content, context }),
        });
        const data = await res.json();
        return data.suggestion || '';
    };

    const handleAISummary = async () => {
        setAiLoading((p) => ({ ...p, summary: true }));
        try {
            const context = `${resume.personalInfo.name}, working in roles like ${resume.experience.map((e) => e.role).join(', ')}`;
            const suggestion = await requestAI('summary', resume.summary, context);
            if (suggestion) updateField('summary', suggestion);
        } finally {
            setAiLoading((p) => ({ ...p, summary: false }));
        }
    };

    const handleAIBullet = async (expIndex: number, bulletIndex: number) => {
        const loadKey = `bullet-${expIndex}-${bulletIndex}`;
        setAiLoading((p) => ({ ...p, [loadKey]: true }));
        try {
            const exp = resume.experience[expIndex];
            const suggestion = await requestAI('bullet', exp.bullets[bulletIndex], {
                role: exp.role,
                company: exp.company,
            });
            if (suggestion) {
                const newExperience = [...resume.experience];
                newExperience[expIndex] = {
                    ...exp,
                    bullets: exp.bullets.map((b, i) => (i === bulletIndex ? suggestion : b)),
                };
                updateField('experience', newExperience);
            }
        } finally {
            setAiLoading((p) => ({ ...p, [loadKey]: false }));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = resume.sectionOrder.indexOf(active.id as string);
            const newIndex = resume.sectionOrder.indexOf(over.id as string);
            updateField('sectionOrder', arrayMove(resume.sectionOrder, oldIndex, newIndex));
        }
    };

    const addExperience = () => {
        const newExp: Experience = {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            bullets: [''],
        };
        updateField('experience', [...resume.experience, newExp]);
    };

    const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
        const newExperience = [...resume.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        updateField('experience', newExperience);
    };

    const removeExperience = (index: number) => {
        updateField(
            'experience',
            resume.experience.filter((_, i) => i !== index)
        );
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: crypto.randomUUID(),
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
        };
        updateField('education', [...resume.education, newEdu]);
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        const newEducation = [...resume.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        updateField('education', newEducation);
    };

    const removeEducation = (index: number) => {
        updateField(
            'education',
            resume.education.filter((_, i) => i !== index)
        );
    };

    const addProject = () => {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            url: '',
            technologies: [],
        };
        updateField('projects', [...resume.projects, newProject]);
    };

    const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
        const newProjects = [...resume.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        updateField('projects', newProjects);
    };

    const removeProject = (index: number) => {
        updateField(
            'projects',
            resume.projects.filter((_, i) => i !== index)
        );
    };

    const inputClass =
        'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all';
    const labelClass = 'block text-xs font-medium text-[var(--text-secondary)] mb-1';
    const sectionTitleClass =
        'text-base font-bold text-[var(--text-primary)] flex items-center gap-2';

    const renderSection = (sectionId: string) => {
        switch (sectionId) {
            case 'summary':
                return (
                    <SortableSection key="summary" id="summary">
                        <div className="editor-section">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={sectionTitleClass}>📝 Summary</h3>
                                <AIButton
                                    onClick={handleAISummary}
                                    loading={!!aiLoading.summary}
                                    label="✨ Generate Summary"
                                />
                            </div>
                            <textarea
                                value={resume.summary}
                                onChange={(e) => updateField('summary', e.target.value)}
                                placeholder="A brief professional summary..."
                                rows={3}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </SortableSection>
                );

            case 'experience':
                return (
                    <SortableSection key="experience" id="experience">
                        <div className="editor-section">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={sectionTitleClass}>💼 Experience</h3>
                                <button onClick={addExperience} className="btn-add">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            {resume.experience.map((exp, expIdx) => (
                                <div key={exp.id} className="bg-[var(--bg-secondary)]/50 rounded-xl p-4 mb-3 border border-[var(--border)]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                            <div>
                                                <label className={labelClass}>Role</label>
                                                <input
                                                    value={exp.role}
                                                    onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                                                    placeholder="Software Engineer"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Company</label>
                                                <input
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                                                    placeholder="Google"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Start Date</label>
                                                <input
                                                    value={exp.startDate}
                                                    onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                                                    placeholder="Jan 2022"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>End Date</label>
                                                <input
                                                    value={exp.endDate}
                                                    onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                                                    placeholder="Present"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => removeExperience(expIdx)} className="ml-3 text-red-400 hover:text-red-300 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Bullet Points</label>
                                        {exp.bullets.map((bullet, bIdx) => (
                                            <div key={bIdx} className="flex items-start gap-2 mb-2">
                                                <input
                                                    value={bullet}
                                                    onChange={(e) => {
                                                        const newBullets = [...exp.bullets];
                                                        newBullets[bIdx] = e.target.value;
                                                        updateExperience(expIdx, 'bullets', newBullets);
                                                    }}
                                                    placeholder="Describe an achievement..."
                                                    className={`${inputClass} flex-1`}
                                                />
                                                <AIButton
                                                    onClick={() => handleAIBullet(expIdx, bIdx)}
                                                    loading={!!aiLoading[`bullet-${expIdx}-${bIdx}`]}
                                                    label="✨"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                                                        updateExperience(expIdx, 'bullets', newBullets);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => updateExperience(expIdx, 'bullets', [...exp.bullets, ''])}
                                            className="text-xs text-teal-400 hover:text-teal-300 mt-1"
                                        >
                                            + Add bullet point
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SortableSection>
                );

            case 'education':
                return (
                    <SortableSection key="education" id="education">
                        <div className="editor-section">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={sectionTitleClass}>🎓 Education</h3>
                                <button onClick={addEducation} className="btn-add">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            {resume.education.map((edu, idx) => (
                                <div key={edu.id} className="bg-[var(--bg-secondary)]/50 rounded-xl p-4 mb-3 border border-[var(--border)]">
                                    <div className="flex justify-between items-start">
                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                            <div>
                                                <label className={labelClass}>Degree</label>
                                                <input
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                                                    placeholder="Bachelor of Science"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Field</label>
                                                <input
                                                    value={edu.field}
                                                    onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                                                    placeholder="Computer Science"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>School</label>
                                                <input
                                                    value={edu.school}
                                                    onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                                                    placeholder="MIT"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className={labelClass}>Start</label>
                                                    <input
                                                        value={edu.startDate}
                                                        onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                                                        placeholder="2018"
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>End</label>
                                                    <input
                                                        value={edu.endDate}
                                                        onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                                                        placeholder="2022"
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeEducation(idx)} className="ml-3 text-red-400 hover:text-red-300 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SortableSection>
                );

            case 'skills':
                return (
                    <SortableSection key="skills" id="skills">
                        <div className="editor-section">
                            <h3 className={`${sectionTitleClass} mb-3`}>🛠️ Skills</h3>
                            <input
                                value={resume.skills.join(', ')}
                                onChange={(e) =>
                                    updateField(
                                        'skills',
                                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                    )
                                }
                                placeholder="React, TypeScript, Node.js, Python..."
                                className={inputClass}
                            />
                            <p className="text-xs text-[var(--text-muted)] mt-1">Separate skills with commas</p>
                        </div>
                    </SortableSection>
                );

            case 'projects':
                return (
                    <SortableSection key="projects" id="projects">
                        <div className="editor-section">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={sectionTitleClass}>🚀 Projects</h3>
                                <button onClick={addProject} className="btn-add">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            {resume.projects.map((project, idx) => (
                                <div key={project.id} className="bg-[var(--bg-secondary)]/50 rounded-xl p-4 mb-3 border border-[var(--border)]">
                                    <div className="flex justify-between items-start">
                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                            <div>
                                                <label className={labelClass}>Name</label>
                                                <input
                                                    value={project.name}
                                                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                                                    placeholder="Project Name"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>URL</label>
                                                <input
                                                    value={project.url}
                                                    onChange={(e) => updateProject(idx, 'url', e.target.value)}
                                                    placeholder="https://github.com/..."
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className={labelClass}>Description</label>
                                                <input
                                                    value={project.description}
                                                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                                                    placeholder="Brief description of the project"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className={labelClass}>Technologies</label>
                                                <input
                                                    value={project.technologies.join(', ')}
                                                    onChange={(e) =>
                                                        updateProject(
                                                            idx,
                                                            'technologies',
                                                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                                        )
                                                    }
                                                    placeholder="React, Node.js..."
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => removeProject(idx)} className="ml-3 text-red-400 hover:text-red-300 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SortableSection>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-4 pl-8">
            {/* Title */}
            <div className="editor-section">
                <label className={labelClass}>Resume Title</label>
                <input
                    value={resume.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="My Resume"
                    className={`${inputClass} text-lg font-semibold`}
                />
            </div>

            {/* Personal Info */}
            <div className="editor-section">
                <h3 className={`${sectionTitleClass} mb-3`}>👤 Personal Info</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input
                            value={resume.personalInfo.name}
                            onChange={(e) => updatePersonalInfo('name', e.target.value)}
                            placeholder="John Doe"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            value={resume.personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            placeholder="john@example.com"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
                        <input
                            value={resume.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            placeholder="+1 234 567 890"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Location</label>
                        <input
                            value={resume.personalInfo.location}
                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                            placeholder="San Francisco, CA"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Website</label>
                        <input
                            value={resume.personalInfo.website}
                            onChange={(e) => updatePersonalInfo('website', e.target.value)}
                            placeholder="https://johndoe.dev"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>LinkedIn</label>
                        <input
                            value={resume.personalInfo.linkedin}
                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                            placeholder="linkedin.com/in/johndoe"
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* Draggable Sections */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={resume.sectionOrder}
                    strategy={verticalListSortingStrategy}
                >
                    {resume.sectionOrder.map(renderSection)}
                </SortableContext>
            </DndContext>
        </div>
    );
}
