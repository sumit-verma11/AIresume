'use client';

import { Resume } from '@/lib/types';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

interface ResumePreviewProps {
    resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
    const renderTemplate = () => {
        switch (resume.template) {
            case 'modern':
                return <ModernTemplate resume={resume} />;
            case 'minimal':
                return <MinimalTemplate resume={resume} />;
            case 'professional':
                return <ProfessionalTemplate resume={resume} />;
            default:
                return <ModernTemplate resume={resume} />;
        }
    };

    return (
        <div className="resume-preview-container">
            <div className="transform scale-[0.75] origin-top">
                {renderTemplate()}
            </div>
        </div>
    );
}
