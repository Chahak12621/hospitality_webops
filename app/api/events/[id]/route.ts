import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// =========================
// UPDATE EVENT
// =========================
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // NEXTJS 15 FIX
    const { id } = await context.params;

    const body = await request.json();

    const {
      name,
      description,
      department,
      assigned_event_head,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("events")
      .update({
        ...(name !== undefined && { name }),

        ...(description !== undefined && {
          description,
        }),

        ...(department !== undefined && {
          department,
        }),

        ...(assigned_event_head !== undefined && {
          assigned_event_head:
            assigned_event_head || null,
        }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE EVENT
// =========================
// =========================
// DELETE EVENT
// =========================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // NEXTJS 15 FIX
    const { id } = await context.params;

    // -----------------------------------
    // REMOVE EVENT ASSIGNMENTS FROM USERS
    // -----------------------------------
    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .update({
          assigned_event_id: null,
        })
        .eq("assigned_event_id", id);

    if (profileError) {
      throw profileError;
    }

    // -----------------------------------
    // DELETE EVENT
    // -----------------------------------
    const { error: deleteError } =
      await supabaseAdmin
        .from("events")
        .delete()
        .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete event",
      },
      { status: 500 }
    );
  }
}