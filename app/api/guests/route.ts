import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

// create user client (NOT server wrapper)
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

// =========================
// GET GUESTS
// =========================
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseUserClient(req);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let query = supabaseAdmin
      .from('guests')
      .select('*')
      .order('updated_at', { ascending: false });

    // EVENT HEAD → ONLY OWN
    if (profile?.role === 'event_head') {
      query = query.eq('created_by', user.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET GUESTS ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

// =========================
// CREATE GUEST
// =========================
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseUserClient(req);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from('guests')
      .insert([
        {
          ...body,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('CREATE GUEST ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to create guest' },
      { status: 500 }
    );
  }
}