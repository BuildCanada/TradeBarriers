import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function verifyAuthToken(request: NextRequest) {
  try {
    // Get the authorization header (Bearer token)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No token provided" };
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the token with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { user: null, error: "Invalid token" };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { user: null, error: "Internal server error" };
  }
}

export function createAuthErrorResponse(message: string, status: number = 401) {
  return Response.json({ error: message }, { status });
}
