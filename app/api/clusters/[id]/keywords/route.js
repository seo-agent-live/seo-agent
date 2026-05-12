import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// POST /api/clusters/[id]/keywords — add keyword to cluster
export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { keyword, intent } = await req.json();
    if (!keyword?.trim()) return NextResponse.json({ error: 'Keyword required' }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('cluster_keywords')
      .insert({
        cluster_id: params.id,
        user_id: userId,
        keyword: keyword.trim().toLowerCase(),
        intent: intent ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ keyword: data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}