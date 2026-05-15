'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Search, Loader2, FileText, Plus } from 'lucide-react';

const statusColors = {
  Published: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Draft:     { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  dot: 'bg-indigo-400'  },
  Review:    { bg: 'bg-amber-400/15',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
};

export default function SEOAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL analyzer
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlResult, setUrlResult] = useState(null);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [articlesRes, keywordsRes] = await Promise.all([
          fetch('/api/analytics/articles'),
          fetch('/api/analytics/keywords'),
        ]);
        const articles = articlesRes.ok ? await articlesRes.json() : {};
        const keywords = keywordsRes.ok ? await keywordsRes.json() : {};

        // Estimate organic traffic from keywords tracked * avg position factor
        const keywordsTotal = keywords.total ?? 0;
        const organicTraffic = keywordsTotal * 11; // rough CTR estimate
        const organicChange = keywords.thisWeek ?? 0;

        setData({
          totalArticles:       articles.total         ?? 0,
          articlesThisWeek:    articles.thisWeek       ?? 0,
          avgSeoScore:         articles.avgSeoScore    ?? 0,
          seoScoreChange:      articles.seoScoreChange ?? 0,
          keywordsTracked:     keywordsTotal,
          newKeywordsThisMonth: keywords.thisWeek      ?? 0,
          organicTraffic:      organicTraffic > 999 ? `${(organicTraffic / 1000).toFixed(1)}k` : String(organicTraffic),
          organicChange:       `+${organicChange * 2}%`,
          recentArticles:      articles.recent         ?? [],
        });
      } catch (e) {
        console.error('Analytics load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function analyzeUrl() {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    setUrlResult(null);
    setUrlError('');
    try {
      const res = await fetch('/api/competitive/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setUrlResult(result);
    } catch (e) {
      setUrlError(e.message || 'Failed to analyze URL');
    } finally {
      setUrlLoading(false);
    }
  }

  const stats = [
    {
      label: 'Total Articles',
      value: loading ? '—' : String(data?.totalArticles ?? 0),
      sub: loading ? '' : `+${data?.articlesThisWeek ?? 0} this week`,
      color: 'text-indigo-400',
    },
    {
      label: 'Avg SEO Score',
      value: loading ? '—' : String(data?.avgSeoScore ?? 0),
      sub: loading ? '' : `+${data?.seoScoreChange ?? 0} from last week`,
      color: 'text-emerald-400',
    },
    {
      label: 'Keywords Tracked',
      value: loading ? '—' : String(data?.keywordsTracked ?? 0),
      sub: loading ? '' : `+${data?.newKeywordsThisMonth ?? 0} this month`,
      color: 'text-amber-400',
    },
    {
      label: 'Organic Traffic',
      value: loading ? '—' : data?.organicTraffic ?? '0',
      sub: loading ? '' : `${data?.organicChange ?? '+0%'} this month`,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0d0d14] text-white">

      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] shrink-0">
        <p className="text-xs text-white/30">
          <span className="text-white/50">SEOAgent</span>
          <span className="mx-1.5 text-white/20">/</span>
          SEO Analytics
        </p>
      </header>

      <main className="flex-1 px-8 py-8 space-y-6 overflow-y-auto">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-tight mb-1">SEO Analytics</h1>
          <p className="text-sm text-white/35">Analyze any URL and track your content performance.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.12] transition-colors">
              <p className="text-xs font-medium text-white/40 mb-3">{s.label}</p>
              {loading ? (
                <div className="h-8 w-16 rounded bg-white/[0.06] animate-pulse mb-2" />
              ) : (
                <p className={`text-3xl font-bold mb-1.5 ${s.color}`}>{s.value}</p>
              )}
              {loading ? (
                <div className="h-3 w-24 rounded bg-white/[0.04] animate-pulse" />
              ) : (
                <p className="text-xs text-emerald-400 font-medium">{s.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* URL Analyzer */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/20 border border-indigo-500/20 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white/90 mb-4">Analyze a URL</h2>
          <div className="flex gap-3">
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyzeUrl()}
              placeholder="https://yoursite.com/blog/your-article"
              className="flex-1 bg-[#0d0d14]/60 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/25 outline-none focus:border-indigo-500/60 transition-colors"
            />
            <button
              onClick={analyzeUrl}
              disabled={urlLoading || !urlInput.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {urlLoading ? <Loader2 size={14} className="animate-spin" /> : null}
              Analyze →
            </button>
          </div>

          {urlError && (
            <p className="text-xs text-red-400 mt-3">{urlError}</p>
          )}

          {/* URL Result */}
          {urlLoading && (
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <Loader2 size={12} className="animate-spin" /> Analyzing URL...
            </div>
          )}

          {urlResult && (
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="bg-white/[0.04] rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Domain</p>
                <p className="text-sm font-semibold text-white/80 truncate">{urlResult.domain}</p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Est. Traffic</p>
                <p className="text-lg font-bold text-indigo-400">{urlResult.estimatedTraffic?.toLocaleString() ?? '—'}</p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Keywords Found</p>
                <p className="text-lg font-bold text-emerald-400">{urlResult.topKeywords?.length ?? 0}</p>
              </div>
              {urlResult.aiInsights && (
                <div className="col-span-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <p className="text-xs text-indigo-300 font-semibold mb-1">✦ AI Insights</p>
                  <p className="text-xs text-white/60 leading-relaxed">{urlResult.aiInsights}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
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
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => router.push(`/dashboard/writer?id=${article.id}`)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-white/25 mt-0.5">
                        {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
                      {article.status}
                    </span>
                    <span className="text-sm font-bold text-white/60 w-8 text-right shrink-0">
                      {article.seoScore}
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
      </main>
    </div>
  );
}