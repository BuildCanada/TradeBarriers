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
    const {
      title,
      summary,
      description,
      jurisdictions,
      deadline,
      status,
      sourceUrl,
    } = body;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(process.env.DATABASE_TABLE_NAME!)
      .insert({
        title,
        summary,
        description,
        jurisdictions,
        deadline,
        status,
        source_url: sourceUrl,
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
