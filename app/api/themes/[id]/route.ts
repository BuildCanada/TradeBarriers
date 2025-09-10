import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// PUT request to update a theme by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 },
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Theme name is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // First, get the old theme name to find agreements using it
    const { data: oldTheme, error: fetchError } = await supabase
      .from(process.env.DATABASE_TABLE_NAME_THEMES!)
      .select("name")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Update the theme name
    const { data, error } = await supabase
      .from(process.env.DATABASE_TABLE_NAME_THEMES!)
      .update({ name: name.trim() })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update all agreements that use this theme
    const { error: updateAgreementsError } = await supabase
      .from(process.env.DATABASE_TABLE_NAME!)
      .update({ theme: name.trim() })
      .eq("theme", oldTheme.name);

    if (updateAgreementsError) {
      console.error(
        "Error updating agreements with new theme name:",
        updateAgreementsError,
      );
      // Don't fail the request, but log the error
    }

    return NextResponse.json(
      { message: "Theme updated successfully", data: data[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Theme update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE request to delete a theme by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!id) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Theme name is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // First check if any agreements are using this theme
    const { data: agreementsUsingTheme, error: checkError } = await supabase
      .from(process.env.DATABASE_TABLE_NAME!)
      .select("id")
      .eq("theme", name)
      .limit(1);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (agreementsUsingTheme && agreementsUsingTheme.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete theme that is being used by agreements" },
        { status: 400 },
      );
    }

    // Delete the theme
    const { error: deleteError } = await supabase
      .from(process.env.DATABASE_TABLE_NAME_THEMES!)
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Theme deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Theme deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
