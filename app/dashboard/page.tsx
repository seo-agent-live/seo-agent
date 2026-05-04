'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Download, Plus, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const statusColors = {
  Published: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Draft:     { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  dot: 'bg-indigo-400'  },
  Review:    { bg: 'bg-amber-400/15',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
};

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
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const emoji = hour < 12 ? '🌤️' : hour < 18 ? '☀️' : '🌙';

  useEffect(() => {
    async function load() {
      try {
        const [articlesRes, keywordsRes] = await Promise.all([
          fetch('/api/analytics/articles'),
          fetch('/api/analytics/keywords'),
        ]);

        const articles = articlesRes.ok ? await articlesRes.json() : {};
        const keywords = keywordsRes.ok ? await keywordsRes.json() : {};

        setData({
          totalArticles:       articles.total          ?? 0,
          articlesThisWeek:    articles.thisWeek        ?? 0,
          avgSeoScore:         articles.avgSeoScore     ?? 0,
          seoScoreChange:      articles.seoScoreChange  ?? 0,
          keywordsTracked:     keywords.total           ?? 0,
          newKeywordsThisWeek: keywords.thisWeek        ?? 0,
          recentArticles:      articles.recent          ?? [],
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
      value: loading ? null : data?.totalArticles ?? 0,
      sub: loading ? null : `↑ ${data?.articlesThisWeek ?? 0} this week`,
    },
    {
      label: 'AVG SEO SCORE',
      value: loading ? null : data?.avgSeoScore ?? 0,
      sub: loading ? null : `↑ ${data?.seoScoreChange ?? 0}pts from last week`,
    },
    {
      label: 'KEYWORDS TRACKED',
      value: loading ? null : data?.keywordsTracked ?? 0,
      sub: loading ? null : `↑ ${data?.newKeywordsThisWeek ?? 0} new this week`,
    },
  ];

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
            <Download size={13} /> Import
          </button>
          <button
            onClick={() => router.push('/dashboard/writer')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-[#0d0d14] text-xs font-semibold hover:bg-white/90 transition-colors"
          >
            <Plus size={13} /> New Article
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/30 transition-colors">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-8 py-8 overflow-y-auto">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white/90 tracking-tight mb-1">
            {greeting}, {firstName} {emoji}
          </h1>
          <p className="text-sm text-white/35">
            Here's your SEO performance overview for the past 7 days.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
            >
              <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase mb-4">
                {s.label}
              </p>
              {s.value === null ? (
                <div className="h-8 w-20 rounded-md bg-white/[0.06] animate-pulse mb-2" />
              ) : (
                <p className="text-3xl font-bold text-white/90 tracking-tight mb-1.5">
                  {s.value}
                </p>
              )}
              {s.sub === null ? (
                <div className="h-3 w-28 rounded bg-white/[0.04] animate-pulse" />
              ) : (
                <p className="text-xs font-medium text-emerald-400">{s.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Articles */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white/80">Recent Articles</h2>
            <Link
              href="/dashboard/library"
              className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
            >
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
                  <div
                    key={article.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => router.push(`/dashboard/writer?id=${article.id}`)}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                    <span className="flex-1 text-[13px] text-white/70 group-hover:text-white/90 transition-colors truncate">
                      {article.title}
                    </span>
                    <span className="text-xs text-white/30 w-6 text-right shrink-0">
                      {article.seoScore}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
                      {article.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                <FileText size={18} className="text-white/20" />
              </div>
              <p className="text-sm text-white/40 mb-1">No articles yet</p>
              <p className="text-xs text-white/25 mb-5">
                Create your first article to get started
              </p>
              <button
                onClick={() => router.push('/dashboard/writer')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
              >
                <Plus size={13} /> New Article
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}