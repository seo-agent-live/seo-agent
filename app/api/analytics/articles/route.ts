import { NextResponse } from 'next/server';

/**
 * Articles analytics route
 *
 * Replace the body of GET() with a real DB query.
 * Examples:
 *
 * Prisma:
 *   const total = await prisma.article.count();
 *   const thisMonth = await prisma.article.count({
 *     where: { createdAt: { gte: startOfMonth } }
 *   });
 *
 * Supabase:
 *   const { count: total } = await supabase.from('articles').select('*', { count: 'exact', head: true });
 *   const { count: thisMonth } = await supabase.from('articles')
 *     .select('*', { count: 'exact', head: true })
 *     .gte('created_at', startOfMonth.toISOString());
 */

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ── Replace below with your real DB query ──
    const total = 0;
    const thisMonth = 0;
    // ───────────────────────────────────────────

    return NextResponse.json({ total, thisMonth });
  } catch (err) {
    console.error('Articles analytics error:', err);
    return NextResponse.json({ total: 0, thisMonth: 0 });
  }
}