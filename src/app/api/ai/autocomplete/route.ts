import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { partialText, role, company } = await req.json();

        if (!partialText) {
            return NextResponse.json({ suggestion: '' });
        }

        const prompt = `You are a professional resume writer assisting a user in real-time. 
The user is currently writing a bullet point for their position as "${role || 'an employee'}" at "${company || 'a company'}".

They have typed: "${partialText}"

Provide the logical continuation of this sentence to complete an impactful, action-oriented resume achievement or responsibility. 
DO NOT repeat what the user has already typed. ONLY provide the REST of the sentence that should seamlessly append to the end of their text.
Keep it concise, professional, and max 10-15 words.

Example:
User typed: "Developed a new REST API"
You output: "that increased data retrieval speed by 40%."
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            messages: [
                { role: 'system', content: 'You are an autocomplete engine. Only output the exact text to append.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 30,
        });

        const completion = response.choices[0]?.message?.content?.trim() || '';

        return NextResponse.json({ suggestion: completion });
    } catch (error) {
        console.error('Autocomplete API Error:', error);
        return NextResponse.json({ suggestion: '' }, { status: 500 });
    }
}
