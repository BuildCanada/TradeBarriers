import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/adminClient";

// Decode JWT token and extract user ID
function decodeJWT(token: string) {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }

    // Decode the payload (second part)
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return payload.sub; // 'sub' field contains the user ID
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new Error("Invalid JWT token");
  }
}

// Update password route
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const accessToken = authHeader.substring(7); // Remove "Bearer " prefix

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const userId = decodeJWT(accessToken);

    const supabase = await createAdminClient();

    // Update the user's password using the user ID
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      console.error("Password update error:", error);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
