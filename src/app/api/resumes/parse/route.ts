import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DEFAULT_SECTION_ORDER } from '@/lib/types';
import pdfParse from '@/lib/pdf-parser';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    const rawText = data.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    const prompt = `
Extract the following information from the resume text provided below and return it as a structured JSON object. 
The JSON schema must strictly follow the Resume interface. 

Resume Interface:
{
  "title": "A short descriptive title for the resume",
  "template": "modern",
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string"
  },
  "summary": "Professional summary string",
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "url": "string",
      "technologies": ["string"]
    }
  ],
  "sectionOrder": ["summary", "experience", "education", "skills", "projects"]
}

Important constraints:
- Return ONLY the JSON object.
- Use empty strings or empty arrays if information is missing.
- Format dates consistently (e.g., "Jan 2020", "2022", or "Present").
- Ensure "sectionOrder" is always included as shown above.

Resume Text:
${rawText}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: 'You are a parsing assistant that extracts structured resume data from raw text into JSON format.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI failed to return content');
    }

    const parsedResume = JSON.parse(content);

    // Ensure required metadata
    parsedResume.createdAt = new Date().toISOString();
    parsedResume.updatedAt = new Date().toISOString();
    if (!parsedResume.sectionOrder) parsedResume.sectionOrder = [...DEFAULT_SECTION_ORDER];
    if (!parsedResume.template) parsedResume.template = 'modern';

    // Assign IDs to list items
    parsedResume.experience = (parsedResume.experience || []).map((exp: any) => ({
      ...exp,
      id: crypto.randomUUID()
    }));
    parsedResume.education = (parsedResume.education || []).map((edu: any) => ({
      ...edu,
      id: crypto.randomUUID()
    }));
    parsedResume.projects = (parsedResume.projects || []).map((proj: any) => ({
      ...proj,
      id: crypto.randomUUID()
    }));

    return NextResponse.json(parsedResume);
  } catch (error: any) {
    console.error('PDF Parse Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
