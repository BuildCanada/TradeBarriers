import { mockCommitments } from '@/lib/mock-data';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    console.log('GET request received');
    try {
        console.log('Returning mock commitments');
        return NextResponse.json(mockCommitments);
    } catch (error) {
        console.error('Generate key error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 