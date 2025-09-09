import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// PUT request to update a specific agreement by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Agreement ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      title,
      summary,
      description,
      jurisdictions,
      jurisdictionStatuses,
      deadline,
      status,
      sourceUrl,
    } = body;

    const supabase = await createClient();

    // Update the agreement
    const { data, error: updateError } = await supabase
      .from(process.env.DATABASE_TABLE_NAME!)
      .update({
        title,
        summary,
        description,
        jurisdictions,
        jurisdiction_statuses: jurisdictionStatuses,
        deadline,
        status,
        source_url: sourceUrl,
      })
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update agreement" },
        { status: 500 },
      );
    }

    // Transform the data to match frontend naming conventions
    const transformedData = data?.[0]
      ? {
          ...data[0],
          sourceUrl: data[0].source_url,
          jurisdictionStatuses: data[0].jurisdiction_statuses,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        }
      : null;

    return NextResponse.json(
      { message: "Agreement updated successfully", data: transformedData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Agreement update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
