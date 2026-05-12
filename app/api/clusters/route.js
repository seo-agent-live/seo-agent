import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// GET /api/clusters — list all clusters with their keywords
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: clusters, error } = await supabase
      .from('clusters')
      .select('*, keywords:cluster_keywords(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ clusters: clusters ?? [] });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/clusters — create a new cluster
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, keywords = [] } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const supabase = getSupabase();

    // Create cluster
    const { data: cluster, error } = await supabase
      .from('clusters')
      .insert({ user_id: userId, name: name.trim() })
      .select()
      .single();

    if (error) throw error;

    // Insert keywords if any
    if (keywords.length > 0) {
      const rows = keywords.map(kw => ({
        cluster_id: cluster.id,
        user_id: userId,
        keyword: typeof kw === 'string' ? kw : kw.keyword,
        intent: kw.intent ?? null,
      }));
      const { data: kws } = await supabase.from('cluster_keywords').insert(rows).select();
      cluster.keywords = kws ?? [];
    } else {
      cluster.keywords = [];
    }

    return NextResponse.json({ cluster });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}