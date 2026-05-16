import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-admin';

function getSupabaseUserClient(req: NextRequest) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization') ?? '',
        },
      },
    }
  );
}

async function getProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return { data, error };
}

// =========================
// UPDATE EVENT
// =========================
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseUserClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await getProfile(user.id);

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      description,
      department,
      assigned_event_head,
    } = await request.json();

    let query = supabaseAdmin.from('events').update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(department !== undefined && { department }),
      ...(assigned_event_head !== undefined && {
        assigned_event_head: assigned_event_head || null,
      }),
    });

    if (profile.role === 'volunteer') {
      query = query.eq('assigned_event_head', user.id);
    }

    const { data, error } = await query.eq('id', id).select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('UPDATE EVENT ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to update event' },
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
    const { id } = await context.params;
    const supabase = getSupabaseUserClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await getProfile(user.id);

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (profile.role === 'volunteer') {
      const { data: eventData, error: eventError } = await supabaseAdmin
        .from('events')
        .select('assigned_event_head')
        .eq('id', id)
        .single();

      if (eventError || eventData?.assigned_event_head !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({ assigned_event_id: null })
      .eq('assigned_event_id', id);

    if (profileUpdateError) {
      throw profileUpdateError;
    }

    const { error: deleteError } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE EVENT ERROR:', error);

    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}