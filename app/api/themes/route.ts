import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// GET request to get all themes
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(process.env.DATABASE_TABLE_NAME_THEMES!)
    .select("id, name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST request to add a new theme
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Theme name is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(process.env.DATABASE_TABLE_NAME_THEMES!)
      .insert({ name: name.trim() })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Theme created successfully", data: data[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Theme creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
