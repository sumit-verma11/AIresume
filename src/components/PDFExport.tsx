'use client';

import { Resume } from '@/lib/types';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
    header: { marginBottom: 20, borderBottom: '2px solid #4F46E5', paddingBottom: 10 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    contact: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6, fontSize: 9, color: '#6B7280' },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
        marginTop: 14,
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: 3,
    },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    entryTitle: { fontSize: 11, fontWeight: 'bold', color: '#1F2937' },
    entrySubtitle: { fontSize: 9, color: '#4F46E5' },
    entryDate: { fontSize: 9, color: '#9CA3AF', fontStyle: 'italic' },
    bullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 10 },
    bulletDot: { width: 10, color: '#4F46E5' },
    bulletText: { flex: 1, color: '#4B5563', lineHeight: 1.4 },
    summary: { color: '#4B5563', lineHeight: 1.5, marginBottom: 4 },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    skill: {
        fontSize: 9,
        backgroundColor: '#EEF2FF',
        color: '#4338CA',
        padding: '3 8',
        borderRadius: 10,
    },
    projectDescription: { color: '#4B5563', fontSize: 9, marginTop: 2 },
    projectTech: { color: '#9CA3AF', fontSize: 8, marginTop: 2, fontStyle: 'italic' },
});

function ResumeDocument({ resume }: { resume: Resume }) {
    const { personalInfo, summary, experience, education, skills, projects, sectionOrder } = resume;

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return summary ? (
                    <View key="summary">
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.summary}>{summary}</Text>
                    </View>
                ) : null;

            case 'experience':
                return experience.length > 0 ? (
                    <View key="experience">
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {experience.map((exp) => (
                            <View key={exp.id} style={{ marginBottom: 8 }}>
                                <View style={styles.entryHeader}>
                                    <View>
                                        <Text style={styles.entryTitle}>{exp.role}</Text>
                                        <Text style={styles.entrySubtitle}>{exp.company}</Text>
                                    </View>
                                    <Text style={styles.entryDate}>
                                        {exp.startDate} – {exp.endDate || 'Present'}
                                    </Text>
                                </View>
                                {exp.bullets.map((bullet, i) => (
                                    <View key={i} style={styles.bullet}>
                                        <Text style={styles.bulletDot}>•</Text>
                                        <Text style={styles.bulletText}>{bullet}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                ) : null;

            case 'education':
                return education.length > 0 ? (
                    <View key="education">
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu) => (
                            <View key={edu.id} style={{ marginBottom: 6 }}>
                                <View style={styles.entryHeader}>
                                    <View>
                                        <Text style={styles.entryTitle}>
                                            {edu.degree} in {edu.field}
                                        </Text>
                                        <Text style={styles.entrySubtitle}>{edu.school}</Text>
                                    </View>
                                    <Text style={styles.entryDate}>
                                        {edu.startDate} – {edu.endDate || 'Present'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : null;

            case 'skills':
                return skills.length > 0 ? (
                    <View key="skills">
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillsContainer}>
                            {skills.map((skill, i) => (
                                <Text key={i} style={styles.skill}>
                                    {skill}
                                </Text>
                            ))}
                        </View>
                    </View>
                ) : null;

            case 'projects':
                return projects.length > 0 ? (
                    <View key="projects">
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((project) => (
                            <View key={project.id} style={{ marginBottom: 6 }}>
                                <Text style={styles.entryTitle}>{project.name}</Text>
                                <Text style={styles.projectDescription}>
                                    {project.description}
                                </Text>
                                {project.technologies.length > 0 && (
                                    <Text style={styles.projectTech}>
                                        Technologies: {project.technologies.join(', ')}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {personalInfo.name || 'Your Name'}
                    </Text>
                    <View style={styles.contact}>
                        {personalInfo.email && <Text>{personalInfo.email}</Text>}
                        {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
                        {personalInfo.location && <Text>{personalInfo.location}</Text>}
                        {personalInfo.website && <Text>{personalInfo.website}</Text>}
                        {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
                    </View>
                </View>
                {sectionOrder.map(renderSection)}
            </Page>
        </Document>
    );
}

export async function generatePDF(resume: Resume): Promise<Blob> {
    const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
    return blob;
}

export function downloadPDF(resume: Resume) {
    generatePDF(resume).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.personalInfo.name || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}
