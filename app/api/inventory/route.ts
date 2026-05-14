import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// =========================
// GET INVENTORY
// =========================
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("inventory_items")
      .select("*")
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "GET INVENTORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch inventory",
      },
      { status: 500 }
    );
  }
}

// =========================
// CREATE INVENTORY ITEM
// =========================
export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    // FRONTEND SENDS THESE
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
        .insert([
          {
            item_name: name, // FIX
            category,
            quantity,
            unit,
            location,
            status,
          },
        ])
        .select()
        .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "CREATE INVENTORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create inventory item",
      },
      { status: 500 }
    );
  }
}