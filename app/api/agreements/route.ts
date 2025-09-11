import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// GET request to get all agreements
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(process.env.DATABASE_TABLE_NAME!)
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST request to add a new Agreement
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(process.env.DATABASE_TABLE_NAME!)
      .insert({
        title: body.title,
        summary: body.summary,
        description: body.description,
        jurisdictions: body.jurisdictions,
        deadline: body.deadline,
        status: body.status,
        source_url: body.sourceUrl,
        theme: body.theme,
        agreement_history: body.agreement_history,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Agreement created successfully", data: data[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Agreement creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
