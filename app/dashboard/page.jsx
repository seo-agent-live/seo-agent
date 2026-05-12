'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ArrowUpRight, FileText } from 'lucide-react';

const statusColors = {
  Published: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Draft:     { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  dot: 'bg-indigo-400'  },
  Review:    { bg: 'bg-amber-400/15',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
};

const quickActions = [
  { label: 'New Article',         emoji: '✍️', href: '/dashboard/writer' },
  { label: 'Research Keywords',   emoji: '🔍', href: '/dashboard/keywords' },
  { label: 'Analyze Competitors', emoji: '📊', href: '/dashboard/competitors' },
  { label: 'Site Audit',          emoji: '🌐', href: '/dashboard/audit' },
];

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const emoji = hour < 12 ? '🌤️' : hour < 18 ? '☀️' : '👋';

  useEffect(() => {
    async function load() {
      try {
        const [articlesRes, keywordsRes, competitorsRes] = await Promise.all([
          fetch('/api/analytics/articles'),
          fetch('/api/analytics/keywords'),
          fetch('/api/competitive'),
        ]);

        const articles    = articlesRes.ok    ? await articlesRes.json()    : {};
        const keywords    = keywordsRes.ok    ? await keywordsRes.json()    : {};
        const competitors = competitorsRes.ok ? await competitorsRes.json() : {};

        // Count competitor gap opportunities from saved analyses
        const analyses = competitors.analyses ?? [];
        const competitorGaps = analyses.length * 5; // estimate 5 gaps per analysis

        const avgScore = articles.avgSeoScore ?? 0;
        const healthLabel = avgScore >= 80 ? 'Good standing' : avgScore >= 50 ? 'Needs work' : 'Poor health';
        const healthIssues = avgScore >= 80 ? 1 : avgScore >= 50 ? 3 : 6;

        setData({
          totalArticles:        articles.total         ?? 0,
          articlesThisWeek:     articles.thisWeek       ?? 0,
          avgSeoScore:          avgScore,
          seoScoreChange:       articles.seoScoreChange ?? 0,
          keywordsTracked:      keywords.total          ?? 0,
          newKeywordsThisWeek:  keywords.thisWeek       ?? 0,
          competitorGaps,
          recentArticles:       articles.recent         ?? [],
          healthScore:          avgScore,
          healthLabel,
          healthIssues,
        });
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    {
      label: 'ARTICLES GENERATED',
      value: data?.totalArticles ?? 0,
      sub: `+${data?.articlesThisWeek ?? 0} this week`,
      subColor: 'text-emerald-400',
    },
    {
      label: 'AVG SEO SCORE',
      value: data?.avgSeoScore ?? 0,
      sub: `+${data?.seoScoreChange ?? 0}pts from last week`,
      subColor: 'text-emerald-400',
    },
    {
      label: 'KEYWORDS TRACKED',
      value: data?.keywordsTracked ?? 0,
      sub: `+${data?.newKeywordsThisWeek ?? 0} new this week`,
      subColor: 'text-emerald-400',
    },
    {
      label: 'COMPETITOR GAPS',
      value: data?.competitorGaps ?? 0,
      sub: `${data?.competitorGaps ?? 0 > 0 ? data?.competitorGaps : 0} new opportunities`,
      subColor: 'text-red-400',
    },
  ];

  // Health ring
  const score = data?.healthScore ?? 0;
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const ringColor = score >= 80 ? '#6366f1' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0d0d14] text-white">

      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] shrink-0">
        <p className="text-xs text-white/30">
          <span className="text-white/50">SEOAgent</span>
          <span className="mx-1.5 text-white/20">/</span>
          Dashboard
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/library')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.07] text-white/60 text-xs font-medium transition-colors"
          >
            Import
          </button>
          <button
            onClick={() => router.push('/dashboard/writer')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-[#0d0d14] text-xs font-semibold hover:bg-white/90 transition-colors"
          >
            <Plus size={13} /> New Article
          </button>
        </div>
      </header>

      <main className="flex-1 px-8 py-8 overflow-y-auto space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-tight mb-1">
            {greeting}, {firstName} {emoji}
          </h1>
          <p className="text-sm text-white/35">Here's your SEO performance overview for the past 7 days.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => router.push(a.href)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-left">
              <span className="text-xl">{a.emoji}</span>
              <span className="text-sm font-medium text-white/70">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.12] transition-colors">
              <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase mb-4">{s.label}</p>
              {loading ? (
                <div className="h-8 w-20 rounded-md bg-white/[0.06] animate-pulse mb-2" />
              ) : (
                <p className="text-3xl font-bold text-white/90 tracking-tight mb-1.5">{s.value}</p>
              )}
              {loading ? (
                <div className="h-3 w-28 rounded bg-white/[0.04] animate-pulse" />
              ) : (
                <p className={`text-xs font-medium ${s.subColor}`}>{s.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom: Recent Articles + SEO Health */}
        <div className="grid grid-cols-3 gap-6">

          {/* Recent Articles — 2/3 width */}
          <div className="col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white/80">Recent Articles</h2>
              <Link href="/dashboard/library"
                className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-3 flex-1 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-3 w-8 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-5 w-16 rounded-full bg-white/[0.06] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : data?.recentArticles?.length > 0 ? (
              <div className="divide-y divide-white/[0.04]">
                {data.recentArticles.map((article) => {
                  const sc = statusColors[article.status] ?? statusColors.Draft;
                  return (
                    <div key={article.id}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => router.push(`/dashboard/writer?id=${article.id}`)}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                      <span className="flex-1 text-[13px] text-white/70 group-hover:text-white/90 transition-colors truncate">
                        {article.title}
                      </span>
                      <span className="text-xs text-white/30 w-6 text-right shrink-0">{article.seoScore}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
                        {article.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={18} className="text-white/20 mb-3" />
                <p className="text-sm text-white/40 mb-1">No articles yet</p>
                <button onClick={() => router.push('/dashboard/writer')}
                  className="flex items-center gap-1.5 px-4 py-2 mt-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors">
                  <Plus size={13} /> New Article
                </button>
              </div>
            )}
          </div>

          {/* SEO Health — 1/3 width */}
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white/80 mb-4">Overall SEO Health</h2>
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/[0.06] animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-3 w-32 rounded bg-white/[0.04] animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    {/* Mini ring */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg width="64" height="64" className="-rotate-90">
                        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                        <circle cx="32" cy="32" r={r} fill="none" stroke={ringColor} strokeWidth="6"
                          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-sm font-bold text-white/90">{score}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{data?.healthLabel}</p>
                      <p className="text-xs text-white/35 mt-0.5">{data?.healthIssues} items need attention</p>
                    </div>
                  </div>
                  <button onClick={() => router.push('/dashboard/audit')}
                    className="w-full py-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors">
                    View Full Report →
                  </button>
                </>
              )}
            </div>

            {/* Top Keywords */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white/80">Top Keywords</h2>
                <Link href="/dashboard/keywords" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  See all
                </Link>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 rounded bg-white/[0.06] animate-pulse" />
                  ))}
                </div>
              ) : (data?.keywordsTracked ?? 0) === 0 ? (
                <p className="text-xs text-white/25 text-center py-3">No keywords tracked yet</p>
              ) : (
                <p className="text-xs text-white/40 text-center py-3">
                  {data?.keywordsTracked} keywords tracked →{' '}
                  <Link href="/dashboard/keywords" className="text-indigo-400 hover:underline">View all</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}