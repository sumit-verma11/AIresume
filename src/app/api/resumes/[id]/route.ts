import { NextRequest, NextResponse } from 'next/server';
import { getResumesDb, setResumesDb } from '@/lib/mongodb';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getResumesDb();
        const resume = db.find(r => r._id === id || r._id === String(id));

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

        const db = getResumesDb();
        const index = db.findIndex(r => r._id === id || r._id === String(id));

        if (index === -1) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const { _id, ...updateData } = body;
        void _id;
        updateData.updatedAt = new Date().toISOString();

        const updatedResume = { ...db[index], ...updateData };
        const newDb = [...db];
        newDb[index] = updatedResume;
        setResumesDb(newDb);

        return NextResponse.json({ success: true, data: updatedResume });
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
        const db = getResumesDb();
        setResumesDb(db.filter(r => r._id !== id && r._id !== String(id)));
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}
