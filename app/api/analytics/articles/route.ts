import { NextResponse } from 'next/server';

function getSupabase() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Total articles
    const { count: total } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    // Articles created this week
    const { count: thisWeek } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Avg SEO score this week
    const { data: thisWeekScores } = await supabase
      .from('articles')
      .select('seo_score')
      .gte('created_at', sevenDaysAgo.toISOString())
      .not('seo_score', 'is', null);

    // Avg SEO score last week (for change calculation)
    const { data: lastWeekScores } = await supabase
      .from('articles')
      .select('seo_score')
      .gte('created_at', fourteenDaysAgo.toISOString())
      .lt('created_at', sevenDaysAgo.toISOString())
      .not('seo_score', 'is', null);

    const avg = (arr) =>
      arr.length ? Math.round(arr.reduce((s, r) => s + r.seo_score, 0) / arr.length) : 0;

    const avgSeoScore = avg(thisWeekScores ?? []);
    const lastAvg = avg(lastWeekScores ?? []);
    const seoScoreChange = avgSeoScore - lastAvg;

    // Recent 10 articles
    const { data: recent } = await supabase
      .from('articles')
      .select('id, title, seo_score, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(10);

    const recentArticles = (recent ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      seoScore: a.seo_score ?? 0,
      status: a.status ?? 'Draft',
      updatedAt: a.updated_at,
    }));

    return NextResponse.json({
      total: total ?? 0,
      thisWeek: thisWeek ?? 0,
      avgSeoScore,
      seoScoreChange,
      recent: recentArticles,
    });
  } catch (err) {
    console.error('Articles analytics error:', err);
    return NextResponse.json({ total: 0, thisWeek: 0, avgSeoScore: 0, seoScoreChange: 0, recent: [] });
  }
}