import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET request to get all commitments
export async function GET() {
    const { data, error } = await supabase.from('commitments').select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to match frontend naming conventions
    const transformedData = data?.map(item => ({
        ...item,
        sourceUrl: item.source_url,
        jurisdictionStatuses: item.jurisdiction_statuses,
        createdAt: item.created_at,
        updatedAt: item.updated_at
    }));

    return NextResponse.json(transformedData);
}

// POST request to add a new commitment
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, summary, description, jurisdictions, jurisdictionStatuses, deadline, status, sourceUrl } = body;

        const { error } = await supabase
            .from('commitments')
            .insert({
                title,
                summary,
                description,
                jurisdictions,
                jurisdiction_statuses: jurisdictionStatuses,
                deadline,
                status,
                source_url: sourceUrl,
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Commitment created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}