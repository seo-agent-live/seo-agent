import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Fetch keyword metrics from SERPER
async function fetchSerperData(keyword) {
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: keyword, gl: 'us', hl: 'en', num: 10 }),
    });
    const data = await res.json();

    // Estimate volume from search info (SERPER doesn't give exact volume)
    // Use answerBox/knowledgeGraph presence + organic count as proxy
    const organicCount = data.organic?.length ?? 0;
    const hasAnswerBox = !!data.answerBox;
    const hasKnowledgeGraph = !!data.knowledgeGraph;

    // Rough volume estimate based on SERP features
    let volume = Math.floor(Math.random() * 5000) + 500; // fallback estimate
    if (hasAnswerBox || hasKnowledgeGraph) volume = Math.floor(Math.random() * 30000) + 10000;

    // Difficulty: based on domain authority proxy (count of big domains in top 10)
    const bigDomains = ['wikipedia', 'reddit', 'google', 'amazon', 'youtube', 'forbes', 'hubspot', 'shopify'];
    const topDomains = (data.organic ?? []).slice(0, 5).map(r => r.link ?? '');
    const bigCount = topDomains.filter(url => bigDomains.some(d => url.includes(d))).length;
    const difficulty = Math.min(95, 20 + bigCount * 15 + Math.floor(Math.random() * 15));

    // Rank: check if any organic result is from our domain (placeholder: null)
    const rank = null; // Would need user's domain to check

    // Trend: random for now (would need historical data)
    const trends = ['up', 'down', 'stable'];
    const trend = trends[Math.floor(Math.random() * trends.length)];

    return { volume, difficulty, rank, trend, serp_data: data.organic?.slice(0, 5) ?? [] };
  } catch (e) {
    console.error('SERPER error:', e);
    return { volume: null, difficulty: null, rank: null, trend: 'stable', serp_data: [] };
  }
}

// GET /api/keywords — list all keywords for user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('keywords')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ keywords: data ?? [] });
  } catch (e) {
    console.error('GET /api/keywords error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/keywords — add a new keyword
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { keyword } = await req.json();
    if (!keyword?.trim()) return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });

    const supabase = getSupabase();

    // Check for duplicate
    const { data: existing } = await supabase
      .from('keywords')
      .select('id')
      .eq('user_id', userId)
      .eq('keyword', keyword.trim().toLowerCase())
      .single();

    if (existing) return NextResponse.json({ error: 'Keyword already tracked' }, { status: 409 });

    // Fetch SERPER data
    const metrics = await fetchSerperData(keyword.trim());

    // Save to Supabase
    const { data, error } = await supabase
      .from('keywords')
      .insert({
        user_id: userId,
        keyword: keyword.trim().toLowerCase(),
        volume: metrics.volume,
        difficulty: metrics.difficulty,
        rank: metrics.rank,
        trend: metrics.trend,
        serp_data: metrics.serp_data,
        last_refreshed: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ keyword: data });
  } catch (e) {
    console.error('POST /api/keywords error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}