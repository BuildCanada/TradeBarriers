import { mockCommitments } from '@/lib/mock-data';
import { NextResponse } from 'next/server';


export async function GET(req: Request) { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.log('GET request received'); // eslint-disable-line no-console
    try {
        console.log('Returning mock commitments'); // eslint-disable-line no-console
        return NextResponse.json(mockCommitments);
    } catch (error) {
        console.error('Generate key error:', error); // eslint-disable-line no-console
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 