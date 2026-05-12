'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Plus, Trash2, RefreshCw, Sparkles, TrendingUp, TrendingDown,
  Minus, Search, ChevronUp, ChevronDown, Loader2
} from 'lucide-react';

const difficultyColor = (d) => {
  if (d <= 30) return 'text-emerald-400';
  if (d <= 60) return 'text-amber-400';
  return 'text-red-400';
};

const difficultyLabel = (d) => {
  if (d <= 30) return 'Easy';
  if (d <= 60) return 'Medium';
  return 'Hard';
};

const trendIcon = (t) => {
  if (t === 'up')   return <TrendingUp  size={13} className="text-emerald-400" />;
  if (t === 'down') return <TrendingDown size={13} className="text-red-400" />;
  return <Minus size={13} className="text-white/30" />;
};

export default function KeywordTrackerPage() {
  const { user } = useUser();
  const [keywords, setKeywords]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState(false);
  const [refreshing, setRefreshing] = useState(null); // keyword id
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiQuery, setAiQuery]       = useState('');
  const [sortBy, setSortBy]         = useState('created_at');
  const [sortDir, setSortDir]       = useState('desc');
  const [search, setSearch]         = useState('');
  const [error, setError]           = useState('');

  // Load keywords from Supabase via API
  useEffect(() => { fetchKeywords(); }, []);

  async function fetchKeywords() {
    setLoading(true);
    try {
      const res = await fetch('/api/keywords');
      const data = await res.json();
      setKeywords(data.keywords ?? []);
    } catch (e) {
      setError('Failed to load keywords.');
    } finally {
      setLoading(false);
    }
  }

  async function addKeyword(kw) {
    const keyword = (kw || input).trim();
    if (!keyword) return;
    setAdding(true);
    setError('');
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add keyword');
      setKeywords(prev => [data.keyword, ...prev]);
      setInput('');
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  }

  async function refreshKeyword(id) {
    setRefreshing(id);
    try {
      const res = await fetch(`/api/keywords/${id}/refresh`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setKeywords(prev => prev.map(k => k.id === id ? data.keyword : k));
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(null);
    }
  }

  async function deleteKeyword(id) {
    try {
      await fetch(`/api/keywords/${id}`, { method: 'DELETE' });
      setKeywords(prev => prev.filter(k => k.id !== id));
    } catch (e) {
      setError('Failed to delete keyword.');
    }
  }

  async function getAiSuggestions() {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiSuggestions([]);
    try {
      const res = await fetch('/api/keywords/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiQuery }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions ?? []);
    } catch (e) {
      setError('AI suggestions failed.');
    } finally {
      setAiLoading(false);
    }
  }

  const sorted = [...keywords]
    .filter(k => k.keyword.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return sortDir === 'asc'
        ? (av > bv ? 1 : -1)
        : (av < bv ? 1 : -1);
    });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronUp size={11} className="text-white/20" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-indigo-400" />
      : <ChevronDown size={11} className="text-indigo-400" />;
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0d0d14] text-white">

      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] shrink-0">
        <p className="text-xs text-white/30">
          <span className="text-white/50">SEOAgent</span>
          <span className="mx-1.5 text-white/20">/</span>
          Keyword Tracker
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">{keywords.length} keywords tracked</span>
        </div>
      </header>

      <main className="flex-1 px-8 py-8 space-y-6 overflow-y-auto">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-tight mb-1">Keyword Tracker</h1>
          <p className="text-sm text-white/35">Track rankings, search volume, and difficulty. Get AI-powered keyword suggestions.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Add keyword + AI suggestions */}
          <div className="space-y-4">

            {/* Add keyword */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white/80 mb-4">Add Keyword</h2>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addKeyword()}
                  placeholder="e.g. best SEO tools"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button
                  onClick={() => addKeyword()}
                  disabled={adding || !input.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                >
                  {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Add
                </button>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-indigo-400" />
                <h2 className="text-sm font-semibold text-white/80">AI Keyword Suggestions</h2>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && getAiSuggestions()}
                  placeholder="e.g. SaaS content marketing"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button
                  onClick={getAiSuggestions}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-50 text-indigo-300 text-xs font-semibold transition-colors"
                >
                  {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                </button>
              </div>

              {aiLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
                  ))}
                </div>
              )}

              {aiSuggestions.length > 0 && (
                <div className="space-y-1.5">
                  {aiSuggestions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-colors group">
                      <span className="text-xs text-white/60 flex-1 truncate">{s.keyword}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {s.intent && (
                          <span className="text-[10px] text-white/25 hidden group-hover:block">{s.intent}</span>
                        )}
                        <button
                          onClick={() => addKeyword(s.keyword)}
                          className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          + Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!aiLoading && aiSuggestions.length === 0 && aiQuery && (
                <p className="text-xs text-white/25 text-center py-4">Enter a topic and click ✦ to get suggestions</p>
              )}
              {!aiLoading && aiSuggestions.length === 0 && !aiQuery && (
                <p className="text-xs text-white/25 text-center py-4">Enter a topic to get AI-powered keyword ideas</p>
              )}
            </div>
          </div>

          {/* Right: Keywords table */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">

            {/* Table toolbar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 flex-1 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5">
                <Search size={12} className="text-white/25 shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter keywords..."
                  className="flex-1 bg-transparent text-xs text-white/60 placeholder-white/20 outline-none"
                />
              </div>
              <button
                onClick={fetchKeywords}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors"
                title="Refresh all"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_80px_80px_60px_36px] gap-2 px-5 py-2.5 border-b border-white/[0.05]">
              {[
                { label: 'Keyword', col: 'keyword' },
                { label: 'Volume',  col: 'volume' },
                { label: 'Rank',    col: 'rank' },
                { label: 'Difficulty', col: 'difficulty' },
                { label: 'Trend',   col: 'trend' },
                { label: '',        col: null },
              ].map(({ label, col }) => (
                <button
                  key={label}
                  onClick={() => col && toggleSort(col)}
                  className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors ${!col ? 'cursor-default' : ''}`}
                >
                  {label}
                  {col && <SortIcon col={col} />}
                </button>
              ))}
            </div>

            {/* Table body */}
            {loading ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search size={24} className="text-white/10 mb-3" />
                <p className="text-sm text-white/30">
                  {search ? 'No keywords match your filter' : 'No keywords tracked yet'}
                </p>
                <p className="text-xs text-white/20 mt-1">
                  {search ? 'Try a different search' : 'Add your first keyword above'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {sorted.map((kw) => (
                  <div key={kw.id} className="grid grid-cols-[1fr_80px_80px_80px_60px_36px] gap-2 items-center px-5 py-3 hover:bg-white/[0.02] transition-colors group">
                    {/* Keyword */}
                    <span className="text-sm text-white/70 truncate">{kw.keyword}</span>

                    {/* Volume */}
                    <span className="text-xs text-white/50 font-mono">
                      {kw.volume != null ? kw.volume.toLocaleString() : '—'}
                    </span>

                    {/* Rank */}
                    <span className={`text-xs font-semibold font-mono ${kw.rank && kw.rank <= 10 ? 'text-emerald-400' : kw.rank ? 'text-white/60' : 'text-white/25'}`}>
                      {kw.rank ? `#${kw.rank}` : '—'}
                    </span>

                    {/* Difficulty */}
                    <div className="flex items-center gap-1.5">
                      {kw.difficulty != null ? (
                        <>
                          <div className="w-12 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${kw.difficulty <= 30 ? 'bg-emerald-400' : kw.difficulty <= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${kw.difficulty}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-medium ${difficultyColor(kw.difficulty)}`}>
                            {difficultyLabel(kw.difficulty)}
                          </span>
                        </>
                      ) : <span className="text-white/25 text-xs">—</span>}
                    </div>

                    {/* Trend */}
                    <div className="flex items-center">
                      {trendIcon(kw.trend)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => refreshKeyword(kw.id)}
                        disabled={refreshing === kw.id}
                        className="p-1 rounded hover:bg-white/[0.08] text-white/30 hover:text-white/60 transition-colors"
                        title="Refresh data"
                      >
                        {refreshing === kw.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <RefreshCw size={12} />}
                      </button>
                      <button
                        onClick={() => deleteKeyword(kw.id)}
                        className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}