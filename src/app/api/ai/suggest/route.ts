import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { type, content, context } = await request.json();

        let prompt = '';

        switch (type) {
            case 'summary':
                prompt = `Write a professional resume summary for someone with the following background. Keep it concise (2-3 sentences), impactful, and use strong action-oriented language. Do not use first person pronouns.

Background context:
${context || 'A professional looking for opportunities'}

${content ? `Current summary to improve: ${content}` : 'Write a new summary from scratch.'}`;
                break;

            case 'bullet':
                prompt = `Improve the following resume bullet point. Make it more impactful using the STAR method (Situation, Task, Action, Result). Use strong action verbs and quantify results where possible. Return ONLY the improved bullet point, nothing else.

Role: ${context?.role || 'Professional'}
Company: ${context?.company || 'Company'}
Original bullet: ${content}`;
                break;

            case 'skills':
                prompt = `Based on the following resume content, suggest 10 relevant technical and soft skills that would strengthen this resume. Return them as a comma-separated list, nothing else.

Resume context:
${content}`;
                break;

            case 'cover_letter': {
                const resumeData = typeof content === 'string' ? JSON.parse(content) : content;
                prompt = `Write a professional cover letter for the following candidate applying to ${context?.company || 'a company'} for the role of ${context?.role || 'a position'}.

Candidate:
- Name: ${resumeData.name || 'Candidate'}
- Experience: ${resumeData.experience || 'Various roles'}
- Skills: ${resumeData.skills || 'Various skills'}
- Summary: ${resumeData.summary || ''}

Write a compelling, personalized cover letter (3-4 paragraphs). Be specific about how the candidate's experience matches the role. Do not include placeholders. Use a professional but warm tone.`;
                break;
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid suggestion type' },
                    { status: 400 }
                );
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an expert resume writer and career coach. Provide concise, professional, and impactful resume content.',
                },
                { role: 'user', content: prompt },
            ],
            max_tokens: type === 'cover_letter' ? 800 : 300,
            temperature: 0.7,
        });

        const suggestion = completion.choices[0]?.message?.content?.trim() || '';

        return NextResponse.json({ suggestion });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('AI Suggest Error:', error);

        if (errorMessage.includes('API key')) {
            return NextResponse.json(
                {
                    suggestion:
                        'AI features require an OpenAI API key. Please set OPENAI_API_KEY in your .env.local file.',
                    error: 'missing_api_key',
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}
