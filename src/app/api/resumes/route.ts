import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createEmptyResume } from '@/lib/types';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const resumes = await db
            .collection('resumes')
            .find({})
            .sort({ updatedAt: -1 })
            .toArray();
        return NextResponse.json(resumes);
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch resumes' },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const { db } = await connectToDatabase();
        const newResume = createEmptyResume();
        const result = await db.collection('resumes').insertOne(newResume);
        return NextResponse.json(
            { ...newResume, _id: result.insertedId },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Failed to create resume' },
            { status: 500 }
        );
    }
}
