import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { db } = await connectToDatabase();
        const resume = await db
            .collection('resumes')
            .findOne({ _id: new ObjectId(id) });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch resume' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { db } = await connectToDatabase();

        const { _id, ...updateData } = body;
        void _id;
        updateData.updatedAt = new Date().toISOString();

        await db
            .collection('resumes')
            .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Failed to update resume' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { db } = await connectToDatabase();
        await db.collection('resumes').deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}
