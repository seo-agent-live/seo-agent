'use client';
import { useState, useEffect } from 'react';

const MODES = [
  { id: 'keywords', label: 'Keyword Ideas', icon: '🔑', placeholder: 'Enter a keyword or topic (e.g. "content marketing")' },
  { id: 'competitors', label: 'Competitor Analysis', icon: '🏆', placeholder: 'Enter a competitor domain (e.g. "ahrefs.com")' },
  { id: 'gaps', label: 'Content Gaps', icon: '🎯', placeholder: 'Enter your niche or topic (e.g. "SaaS SEO")' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'difficulty-asc', label: 'Difficulty: Low → High' },
  { value: 'difficulty-desc', label: 'Difficulty: High → Low' },
  { value: 'alpha', label: 'A → Z' },
];

const DIFFICULTY_ORDER: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
const PRIORITY_ORDER: Record<string, number> = { High: 1, Medium: 2, Low: 3 };

function diffColor(diff: string) {
  if (diff === 'Low') return { bg: 'rgba(29,184,160,0.12)', color: '#1DB8A0' };
  if (diff === 'Medium') return { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' };
  return { bg: 'rgba(226,75,74,0.12)', color: '#E24B4A' };
}

function priorityColor(p: string) {
  if (p === 'High') return { bg: 'rgba(29,184,160,0.12)', color: '#1DB8A0' };
  if (p === 'Medium') return { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' };
  return { bg: 'rgba(139,148,158,0.12)', color: '#8B949E' };
}

function intentColor(intent: string) {
  const map: Record<string, { bg: string; color: string }> = {
    informational: { bg: 'rgba(79,124,255,0.12)', color: '#4F7CFF' },
    commercial: { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA' },
    transactional: { bg: 'rgba(29,184,160,0.12)', color: '#1DB8A0' },
    navigational: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  };
  return map[intent?.toLowerCase()] || { bg: 'rgba(139,148,158,0.12)', color: '#8B949E' };
}

function KeywordRow({ kw, index, onTrack, tracked }: { kw: any; index: number; onTrack: (k: string) => void; tracked: boolean }) {
  const [hovered, setHovered] = useState(false);
  const dc = diffColor(kw.difficulty);
  const ic = intentColor(kw.intent);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 18px',
        background: hovered ? '#1C2128' : '#161B22',
        border: `1px solid ${hovered ? '#30363D' : '#21262D'}`,
        borderRadius: '10px', marginBottom: '6px',
        transition: 'all 0.15s', cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '11px', color: '#8B949E', fontWeight: '600', minWidth: '22px' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontSize: '14px', color: '#E8EDF8', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {kw.keyword}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
        {kw.volume && (
          <span style={{ fontSize: '11px', color: '#8B949E', minWidth: '60px', textAlign: 'right' }}>
            {kw.volume} / mo
          </span>
        )}
        <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '5px', background: ic.bg, color: ic.color }}>
          {kw.intent}
        </span>
        <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '5px', background: dc.bg, color: dc.color }}>
          {kw.difficulty}
        </span>
        <button
          onClick={() => onTrack(kw.keyword)}
          style={{
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit', border: '1px solid',
            background: tracked ? 'rgba(29,184,160,0.12)' : 'transparent',
            borderColor: tracked ? '#1DB8A0' : '#21262D',
            color: tracked ? '#1DB8A0' : '#8B949E',
            transition: 'all 0.15s',
          }}
        >
          {tracked ? '✓ Tracked' : '+ Track'}
        </button>
      </div>
    </div>
  );
}

function PageCard({ page, index }: { page: any; index: number }) {
  return (
    <div style={{ padding: '16px 18px', background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#4F7CFF', background: 'rgba(79,124,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
          #{index + 1}
        </span>
        <span style={{ fontSize: '12px', color: '#8B949E' }}>{page.domain}</span>
      </div>
      <div style={{ fontSize: '14px', color: '#E8EDF8', fontWeight: '500', marginBottom: '6px' }}>{page.title}</div>
      <div style={{ fontSize: '12px', color: '#8B949E', lineHeight: '1.6' }}>{page.snippet}</div>
    </div>
  );
}

function GapCard({ gap, index, onGenerate }: { gap: any; index: number; onGenerate: (t: string) => void }) {
  const pc = priorityColor(gap.priority);
  return (
    <div style={{ padding: '18px', background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#8B949E', fontWeight: '600', minWidth: '22px' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8' }}>{gap.topic}</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '5px', background: pc.bg, color: pc.color, flexShrink: 0 }}>
          {gap.priority} priority
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', margin: '0 0 12px 32px' }}>{gap.opportunity}</p>
      <div style={{ marginLeft: '32px' }}>
        <button
          onClick={() => onGenerate(gap.topic)}
          style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)', color: '#4F7CFF' }}
        >
          ✍️ Write Article on This →
        </button>
      </div>
    </div>
  );
}

const HISTORY_KEY = 'rankflow_research_history';

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('keywords');
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackedKeywords, setTrackedKeywords] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setSearchHistory(hist);
      const tracked = JSON.parse(localStorage.getItem('rankflow_tracked_kws') || '[]');
      setTrackedKeywords(tracked);
    } catch {}
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery || query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError(null);
    setResults(null);
    setSortBy('default');
    setFilterDifficulty('all');

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);

      const entry = { query: q, mode, date: new Date().toLocaleDateString(), timestamp: Date.now() };
      const updated = [entry, ...searchHistory.filter((h: any) => !(h.query === q && h.mode === mode))].slice(0, 20);
      setSearchHistory(updated);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (newMode: string) => {
    setMode(newMode);
    setResults(null);
    setError(null);
    setSortBy('default');
    setFilterDifficulty('all');
  };

  const handleTrackKeyword = (kw: string) => {
    const isTracked = trackedKeywords.includes(kw);
    const updated = isTracked ? trackedKeywords.filter(k => k !== kw) : [...trackedKeywords, kw];
    setTrackedKeywords(updated);
    try { localStorage.setItem('rankflow_tracked_kws', JSON.stringify(updated)); } catch {}
    showNotif(isTracked ? `Removed "${kw}" from tracker` : `Added "${kw}" to keyword tracker`);
  };

  const handleGenerateArticle = (topic: string) => {
    window.location.href = `/dashboard/writer?keyword=${encodeURIComponent(topic)}`;
  };

  const handleExportCSV = () => {
    if (!results?.keywords) return;
    const rows = [['Keyword', 'Intent', 'Difficulty', 'Volume']];
    results.keywords.forEach((kw: any) => rows.push([kw.keyword, kw.intent, kw.difficulty, kw.volume || '']));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords-${query.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotif('Keywords exported as CSV');
  };

  const handleCopyAll = () => {
    if (!results?.keywords) return;
    const text = results.keywords.map((k: any) => k.keyword).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotif('All keywords copied to clipboard');
  };

  const processedKeywords = (() => {
    if (!results?.keywords) return [];
    let kws = [...results.keywords];
    if (filterDifficulty !== 'all') kws = kws.filter((k: any) => k.difficulty === filterDifficulty);
    if (sortBy === 'difficulty-asc') kws.sort((a: any, b: any) => (DIFFICULTY_ORDER[a.difficulty] || 0) - (DIFFICULTY_ORDER[b.difficulty] || 0));
    else if (sortBy === 'difficulty-desc') kws.sort((a: any, b: any) => (DIFFICULTY_ORDER[b.difficulty] || 0) - (DIFFICULTY_ORDER[a.difficulty] || 0));
    else if (sortBy === 'alpha') kws.sort((a: any, b: any) => a.keyword.localeCompare(b.keyword));
    return kws;
  })();

  const currentMode = MODES.find(m => m.id === mode);
  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', background: '#161B22', border: '1px solid #21262D',
    borderRadius: '8px', color: '#C9D1D9', fontSize: '12px',
    outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .research-input:focus { border-color: rgba(79,124,255,0.5) !important; box-shadow: 0 0 0 3px rgba(79,124,255,0.08); }
        .research-input::placeholder { color: #30363D; }
      `}</style>

      {notification && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', padding: '12px 18px', fontSize: '13px', color: '#E8EDF8', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          ✓ {notification}
        </div>
      )}

      <div style={{ padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: 0, marginBottom: '6px' }}>🔎 Research</h1>
            <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>Discover keywords, analyse competitors, and find content gaps.</p>
          </div>
          <button onClick={() => setShowHistory(!showHistory)} style={{ fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #21262D', background: showHistory ? '#161B22' : 'transparent', color: '#8B949E', cursor: 'pointer', fontFamily: 'inherit' }}>
            🕘 History {searchHistory.length > 0 && `(${searchHistory.length})`}
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>Recent Searches</div>
            {searchHistory.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#8B949E', textAlign: 'center', padding: '16px 0' }}>No searches yet.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {searchHistory.map((h: any, i: number) => (
                  <button key={i} onClick={() => { handleModeSwitch(h.mode); setQuery(h.query); handleSearch(h.query); setShowHistory(false); }} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', background: '#0D1117', border: '1px solid #21262D', color: '#C9D1D9' }}>
                    {h.mode === 'keywords' ? '🔑' : h.mode === 'competitors' ? '🏆' : '🎯'} {h.query}
                    <span style={{ marginLeft: '6px', color: '#8B949E', fontSize: '10px' }}>{h.date}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', padding: '5px', width: 'fit-content' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => handleModeSwitch(m.id)} style={{ padding: '8px 18px', borderRadius: '7px', border: 'none', background: mode === m.id ? 'rgba(79,124,255,0.15)' : 'transparent', color: mode === m.id ? '#4F7CFF' : '#8B949E', fontSize: '13px', fontWeight: mode === m.id ? '600' : '400', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Search Row */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          <input
            className="research-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder={currentMode?.placeholder}
            style={{ flex: 1, padding: '11px 16px', background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', color: '#E8EDF8', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          <button onClick={() => handleSearch(query)} disabled={loading || !query.trim()} style={{ padding: '11px 24px', background: loading || !query.trim() ? 'rgba(79,124,255,0.3)' : '#4F7CFF', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {loading ? `Searching${loadingDots}` : 'Search →'}
          </button>
        </div>

        {error && (
          <div style={{ padding: '14px 18px', background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: '10px', color: '#E24B4A', fontSize: '13px', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid rgba(79,124,255,0.15)', borderTop: '3px solid #4F7CFF', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '14px', color: '#8B949E', margin: 0 }}>
              {mode === 'keywords' && 'Analysing keyword opportunities...'}
              {mode === 'competitors' && 'Scanning competitor data...'}
              {mode === 'gaps' && 'Identifying content gaps...'}
            </p>
          </div>
        )}

        {!loading && !results && !error && (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>{currentMode?.icon}</div>
            <p style={{ fontSize: '14px', color: '#8B949E', marginBottom: '6px' }}>
              {mode === 'keywords' && 'Enter a topic to discover keyword opportunities'}
              {mode === 'competitors' && 'Enter a domain to analyse competitor strategies'}
              {mode === 'gaps' && 'Enter your niche to uncover content gap opportunities'}
            </p>
            <p style={{ fontSize: '12px', color: '#30363D', margin: 0 }}>Press Enter or click Search to get started</p>
          </div>
        )}

        {results && !loading && (
          <div>

            {/* KEYWORD IDEAS */}
            {mode === 'keywords' && results.keywords && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8' }}>
                    🔑 Keyword ideas for <span style={{ color: '#4F7CFF' }}>"{query}"</span>
                    <span style={{ fontSize: '12px', color: '#8B949E', fontWeight: '400', marginLeft: '8px' }}>{processedKeywords.length} / {results.keywords.length} results</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} style={selectStyle}>
                      <option value="all">All Difficulties</option>
                      <option value="Low">Low only</option>
                      <option value="Medium">Medium only</option>
                      <option value="High">High only</option>
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={handleCopyAll} style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: copied ? 'rgba(29,184,160,0.12)' : 'transparent', border: `1px solid ${copied ? '#1DB8A0' : '#21262D'}`, color: copied ? '#1DB8A0' : '#8B949E' }}>
                      {copied ? '✓ Copied' : '📋 Copy All'}
                    </button>
                    <button onClick={handleExportCSV} style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>
                      ⬇️ Export CSV
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
                  {['Low', 'Medium', 'High'].map(d => {
                    const dc = diffColor(d);
                    const count = results.keywords.filter((k: any) => k.difficulty === d).length;
                    return (
                      <button key={d} onClick={() => setFilterDifficulty(filterDifficulty === d ? 'all' : d)} style={{ padding: '12px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', background: filterDifficulty === d ? dc.bg : '#161B22', border: `1px solid ${filterDifficulty === d ? dc.color : '#21262D'}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: dc.color }}>{count}</div>
                        <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '2px' }}>{d} Difficulty</div>
                      </button>
                    );
                  })}
                </div>

                {trackedKeywords.length > 0 && (
                  <div style={{ padding: '10px 14px', background: 'rgba(29,184,160,0.08)', border: '1px solid rgba(29,184,160,0.2)', borderRadius: '8px', fontSize: '12px', color: '#1DB8A0', marginBottom: '12px' }}>
                    ✓ {trackedKeywords.length} keyword{trackedKeywords.length > 1 ? 's' : ''} added to your tracker
                    <a href="/dashboard/keywords" style={{ color: '#1DB8A0', marginLeft: '8px', fontWeight: '600' }}>View tracker →</a>
                  </div>
                )}

                {processedKeywords.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8B949E', fontSize: '13px' }}>No keywords match the current filter.</div>
                ) : (
                  processedKeywords.map((kw: any, i: number) => (
                    <KeywordRow key={i} kw={kw} index={i} onTrack={handleTrackKeyword} tracked={trackedKeywords.includes(kw.keyword)} />
                  ))
                )}

                {results.topPages?.length > 0 && (
                  <>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8', margin: '32px 0 12px' }}>📄 Top ranking pages</div>
                    {results.topPages.map((page: any, i: number) => <PageCard key={i} page={page} index={i} />)}
                  </>
                )}
              </>
            )}

            {/* COMPETITOR ANALYSIS */}
            {mode === 'competitors' && results.analysis && (
              <>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>
                  🏆 Competitor breakdown for <span style={{ color: '#4F7CFF' }}>{query}</span>
                </div>
                <div style={{ padding: '20px', background: 'rgba(79,124,255,0.06)', border: '1px solid rgba(79,124,255,0.15)', borderRadius: '12px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#C9D1D9', lineHeight: '1.8', margin: 0 }}>{results.analysis}</p>
                </div>

                {results.stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
                    {Object.entries(results.stats).map(([key, val]) => (
                      <div key={key} style={{ padding: '14px', background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#4F7CFF' }}>{String(val)}</div>
                        <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '2px', textTransform: 'capitalize' }}>{key}</div>
                      </div>
                    ))}
                  </div>
                )}

                {results.keywords?.length > 0 && (
                  <>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8', margin: '24px 0 12px' }}>🔑 Their top keywords</div>
                    {results.keywords.map((kw: any, i: number) => (
                      <KeywordRow key={i} kw={kw} index={i} onTrack={handleTrackKeyword} tracked={trackedKeywords.includes(kw.keyword)} />
                    ))}
                  </>
                )}

                {results.topPages?.length > 0 && (
                  <>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8', margin: '24px 0 12px' }}>📄 Their top pages</div>
                    {results.topPages.map((page: any, i: number) => <PageCard key={i} page={page} index={i} />)}
                  </>
                )}
              </>
            )}

            {/* CONTENT GAPS */}
            {mode === 'gaps' && results.gaps && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8' }}>
                    🎯 Content gap opportunities for <span style={{ color: '#4F7CFF' }}>"{query}"</span>
                    <span style={{ fontSize: '12px', color: '#8B949E', fontWeight: '400', marginLeft: '8px' }}>{results.gaps.length} found</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
                  {['High', 'Medium', 'Low'].map(p => {
                    const pc = priorityColor(p);
                    const count = results.gaps.filter((g: any) => g.priority === p).length;
                    return (
                      <div key={p} style={{ padding: '12px', background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: pc.color }}>{count}</div>
                        <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '2px' }}>{p} Priority</div>
                      </div>
                    );
                  })}
                </div>

                {[...results.gaps]
                  .sort((a: any, b: any) => (PRIORITY_ORDER[a.priority] || 9) - (PRIORITY_ORDER[b.priority] || 9))
                  .map((gap: any, i: number) => (
                    <GapCard key={i} gap={gap} index={i} onGenerate={handleGenerateArticle} />
                  ))}
              </>
            )}

          </div>
        )}
      </div>
    </>
  );
}