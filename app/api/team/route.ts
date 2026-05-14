import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET ALL TEAM MEMBERS
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("full_name");

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("TEAM GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}