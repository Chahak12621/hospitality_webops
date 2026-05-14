import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { supabaseAdmin } from '@/lib/supabase-admin';

// ================= PATCH TEAM MEMBER =================

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // IMPORTANT: await params in Next.js App Router
    const { id } = await params;

    const body = await request.json();

    const {
      full_name,
      phone,
      role,
      assigned_event_id,
    } = body;

    const updateData: {
      full_name?: string;
      phone?: string | null;
      role?: string;
      assigned_event_id?: string | null;
    } = {};

    if (full_name !== undefined) {
      updateData.full_name = full_name;
    }

    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    if (assigned_event_id !== undefined) {
      updateData.assigned_event_id =
        assigned_event_id || null;
    }

    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
      console.error(
        'TEAM PATCH ERROR:',
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'PATCH ROUTE ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to update team member',
      },
      { status: 500 }
    );
  }
}

// ================= DELETE TEAM MEMBER =================

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // IMPORTANT: await params
    const { id } = await params;

    const { error } =
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
      console.error(
        'TEAM DELETE ERROR:',
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'DELETE ROUTE ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to delete team member',
      },
      { status: 500 }
    );
  }
}