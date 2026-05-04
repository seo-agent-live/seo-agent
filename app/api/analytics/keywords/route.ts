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
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Total keywords tracked
    const { count: total } = await supabase
      .from('keywords')
      .select('*', { count: 'exact', head: true });

    // New keywords added this week
    const { count: thisWeek } = await supabase
      .from('keywords')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    return NextResponse.json({
      total: total ?? 0,
      thisWeek: thisWeek ?? 0,
    });
  } catch (err) {
    console.error('Keywords analytics error:', err);
    return NextResponse.json({ total: 0, thisWeek: 0 });
  }
}