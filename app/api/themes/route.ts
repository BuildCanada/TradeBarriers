import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// GET request to get all themes
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(process.env.DATABASE_TABLE_NAME_THEMES!)
    .select("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Extract theme names from the objects
  const themes = data?.map((item) => item.name) || [];

  return NextResponse.json(themes);
}
