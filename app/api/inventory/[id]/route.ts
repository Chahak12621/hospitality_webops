import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

// =========================
// UPDATE INVENTORY ITEM
// =========================
export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // NEXTJS 15 FIX
    const { id } =
      await context.params;

    const body = await request.json();

    const {
      name,
      category,
      quantity,
      unit,
      location,
      status,
    } = body;

    const { data, error } =
      await supabaseAdmin
        .from("inventory_items")
        .update({
          item_name: name, // FIX
          category,
          quantity,
          unit,
          location,
          status,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "UPDATE INVENTORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update inventory item",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE INVENTORY ITEM
// =========================
export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // NEXTJS 15 FIX
    const { id } =
      await context.params;

    const { error } =
      await supabaseAdmin
        .from("inventory_items")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE INVENTORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete inventory item",
      },
      { status: 500 }
    );
  }
}