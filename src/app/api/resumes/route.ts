import { NextResponse } from 'next/server';
import { getResumesDb, setResumesDb } from '@/lib/mongodb';
import { createEmptyResume } from '@/lib/types';

export async function GET() {
    try {
        const resumes = [...getResumesDb()].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        return NextResponse.json(resumes);
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch resumes' },
            { status: 500 }
        );
    }
}

export async function POST(request?: Request) {
    try {
        let partialData = {};
        if (request) {
            try {
                partialData = await request.json();
            } catch {
                // Ignore empty bodies
            }
        }
        const newResume = {
            ...createEmptyResume(),
            ...partialData,
            _id: crypto.randomUUID()
        };
        const db = getResumesDb();
        setResumesDb([...db, newResume]);
        return NextResponse.json(newResume, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Failed to create resume' },
            { status: 500 }
        );
    }
}
