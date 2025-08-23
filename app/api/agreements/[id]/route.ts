import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// DELETE request to delete a specific agreement by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Agreement ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Delete the agreement
    const { error: deleteError } = await supabase
      .from(process.env.DATABASE_TABLE_NAME!)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete agreement" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Agreement deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Agreement deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
