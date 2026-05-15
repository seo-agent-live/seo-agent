'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe, Search, TrendingUp, BarChart2, Sparkles, Trash2,
  ChevronDown, ChevronUp, Loader2, Plus, ExternalLink, Clock
} from 'lucide-react';

const tabs = ['URL Analysis', 'Topic Comparison', 'Saved Analyses'];

export default function CompetitiveAnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('URL Analysis');

  // URL Analysis state
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlResult, setUrlResult] = useState(null);

  // Topic Comparison state
  const [topicInput, setTopicInput] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '']);
  const [topicLoading, setTopicLoading] = useState(false);
  const [topicResult, setTopicResult] = useState(null);

  // Saved analyses
  const [saved, setSaved] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const [error, setError] = useState('');

  useEffect(() => { fetchSaved(); }, []);

  async function fetchSaved() {
    setSavedLoading(true);
    try {
      const res = await fetch('/api/competitive');
      const data = await res.json();
      setSaved(data.analyses ?? []);
    } catch { } finally { setSavedLoading(false); }
  }

  async function analyzeUrl() {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    setUrlResult(null);
    setError('');
    try {
      const res = await fetch('/api/competitive/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUrlResult(data);
      fetchSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setUrlLoading(false);
    }
  }

  async function analyzeTopic() {
    if (!topicInput.trim()) return;
    setTopicLoading(true);
    setTopicResult(null);
    setError('');
    try {
      const res = await fetch('/api/competitive/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput.trim(),
          competitors: competitors.filter(c => c.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTopicResult(data);
      fetchSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setTopicLoading(false);
    }
  }

  async function deleteAnalysis(id) {
    try {
      await fetch(`/api/competitive/${id}`, { method: 'DELETE' });
      setSaved(prev => prev.filter(a => a.id !== id));
    } catch { setError('Failed to delete.'); }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0d0d14] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] shrink-0">
        <p className="text-xs text-white/30">
          <span className="text-white/50">SEOAgent</span>
          <span className="mx-1.5 text-white/20">/</span>
          Competitive Analysis
        </p>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-400/15 text-amber-400">Pro</span>
      </header>

      <main className="flex-1 px-8 py-8 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-tight mb-1">Competitive Analysis</h1>
          <p className="text-sm text-white/35">Analyze competitor URLs and compare performance across topics using real SERP data.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === t ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/40 hover:text-white/60'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── URL ANALYSIS TAB ── */}
        {activeTab === 'URL Analysis' && (
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={15} className="text-indigo-400" />
                <h2 className="text-sm font-semibold text-white/80">Analyze Competitor URL</h2>
              </div>
              <p className="text-xs text-white/30 mb-4">Enter a competitor's domain to see their top ranking pages, estimated traffic, and keyword opportunities.</p>
              <div className="flex gap-2">
                <input
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyzeUrl()}
                  placeholder="e.g. https://ahrefs.com or ahrefs.com"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button onClick={analyzeUrl} disabled={urlLoading || !urlInput.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                  {urlLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  Analyze
                </button>
              </div>
            </div>

            {/* URL Result */}
            {urlLoading && <SkeletonCard rows={6} />}
            {urlResult && <UrlResultCard result={urlResult} />}
          </div>
        )}

        {/* ── TOPIC COMPARISON TAB ── */}
        {activeTab === 'Topic Comparison' && (
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={15} className="text-indigo-400" />
                <h2 className="text-sm font-semibold text-white/80">Compare Competitors on a Topic</h2>
              </div>
              <p className="text-xs text-white/30 mb-5">Enter a topic and up to 3 competitor domains to see who dominates the SERP.</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">Topic / Keyword</label>
                  <input
                    value={topicInput}
                    onChange={e => setTopicInput(e.target.value)}
                    placeholder="e.g. best SEO tools for startups"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">Competitor Domains (optional)</label>
                  <div className="space-y-2">
                    {competitors.map((c, i) => (
                      <input key={i}
                        value={c}
                        onChange={e => setCompetitors(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                        placeholder={`Competitor ${i + 1} (e.g. moz.com)`}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={analyzeTopic} disabled={topicLoading || !topicInput.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                {topicLoading ? <Loader2 size={14} className="animate-spin" /> : <BarChart2 size={14} />}
                Compare Now
              </button>
            </div>

            {topicLoading && <SkeletonCard rows={8} />}
            {topicResult && <TopicResultCard result={topicResult} />}
          </div>
        )}

        {/* ── SAVED ANALYSES TAB ── */}
        {activeTab === 'Saved Analyses' && (
          <div className="space-y-3">
            {savedLoading ? (
              <SkeletonCard rows={4} />
            ) : saved.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BarChart2 size={28} className="text-white/10 mb-3" />
                <p className="text-sm text-white/30">No analyses saved yet</p>
                <p className="text-xs text-white/20 mt-1">Run a URL or topic analysis to save results</p>
              </div>
            ) : saved.map(a => (
              <div key={a.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${a.type === 'url' ? 'bg-indigo-500/15' : 'bg-emerald-500/15'}`}>
                      {a.type === 'url' ? <Globe size={13} className="text-indigo-400" /> : <BarChart2 size={13} className="text-emerald-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">{a.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-white/20" />
                        <p className="text-[11px] text-white/30">{new Date(a.created_at).toLocaleDateString()}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${a.type === 'url' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                          {a.type === 'url' ? 'URL' : 'Topic'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); deleteAnalysis(a.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                    {expanded === a.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                  </div>
                </div>
                {expanded === a.id && (
                  <div className="px-5 pb-5 border-t border-white/[0.05]">
                    <pre className="text-xs text-white/50 mt-4 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(a.result_data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SkeletonCard({ rows }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-8 rounded-lg bg-white/[0.04] animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}

function UrlResultCard({ result }) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Domain', value: result.domain },
          { label: 'Est. Monthly Traffic', value: result.estimatedTraffic?.toLocaleString() ?? '—' },
          { label: 'Top Keywords Found', value: result.topKeywords?.length ?? 0 },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-2">{s.label}</p>
            <p className="text-xl font-bold text-white/90">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Top keywords */}
      {result.topKeywords?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white/80">Top Ranking Keywords</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {result.topKeywords.map((kw, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs text-white/20 w-5 shrink-0">#{i + 1}</span>
                <span className="flex-1 text-sm text-white/70">{kw.keyword}</span>
                <span className="text-xs text-white/40 font-mono">{kw.volume?.toLocaleString() ?? '—'} vol</span>
                <span className="text-xs text-white/40">Pos {kw.position ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {result.aiInsights && (
        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-indigo-300">AI Insights</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{result.aiInsights}</p>
        </div>
      )}
    </div>
  );
}

function TopicResultCard({ result }) {
  return (
    <div className="space-y-4">
      {/* SERP positions */}
      {result.serpResults?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white/80">SERP Results for "{result.topic}"</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {result.serpResults.map((r, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                <span className={`text-xs font-bold w-5 shrink-0 mt-0.5 ${i < 3 ? 'text-amber-400' : 'text-white/25'}`}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate group-hover:text-white/90 transition-colors">{r.title}</p>
                  <p className="text-xs text-white/30 truncate mt-0.5">{r.link}</p>
                </div>
                <a href={r.link} target="_blank" rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-white/[0.08] text-white/20 hover:text-white/50 transition-colors shrink-0">
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor breakdown */}
      {result.competitorBreakdown?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white/80">Competitor Presence</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {result.competitorBreakdown.map((c, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <span className="text-sm text-white/60 flex-1">{c.domain}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(100, c.presence * 10)}%` }} />
                  </div>
                  <span className="text-xs text-white/40 w-16 text-right">{c.positions?.join(', ') ?? '—'} positions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {result.aiInsights && (
        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-indigo-300">AI Strategic Insights</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{result.aiInsights}</p>
        </div>
      )}
    </div>
  );
}