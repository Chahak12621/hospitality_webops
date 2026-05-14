import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
// GET EVENTS
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// CREATE EVENT
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      department,
      assigned_event_head,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("events")
      .insert([
        {
          name,
          description,
          department,
          assigned_event_head:
            assigned_event_head || null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}