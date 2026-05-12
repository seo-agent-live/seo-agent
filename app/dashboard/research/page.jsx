'use client';
import { useState } from 'react';

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('keywords');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Research
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Discover keywords, analyze competitors, and find content gaps.
      </p>

      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'keywords', label: '🔑 Keyword Ideas' },
          { id: 'competitors', label: '🏆 Competitor Analysis' },
          { id: 'gaps', label: '🎯 Content Gaps' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid', borderColor: mode === m.id ? '#6366f1' : 'rgba(255,255,255,0.1)', background: mode === m.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: mode === m.id ? '#a5b4fc' : '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder={
            mode === 'keywords' ? 'Enter a keyword or topic (e.g. "content marketing")' :
            mode === 'competitors' ? 'Enter a competitor URL or domain (e.g. "ahrefs.com")' :
            'Enter your niche or topic (e.g. "SaaS SEO")'
          }
          style={{ flex: 1, padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
        />
        <button onClick={handleSearch} disabled={loading || !query.trim()} style={{ padding: '12px 24px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {loading ? 'Searching...' : 'Search →'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '14px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <p>Analyzing search data...</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div>
          {/* Keyword Ideas */}
          {mode === 'keywords' && results.keywords && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>Keyword Ideas for "{query}"</h2>
              <div style={{ display: 'grid', gap: '8px' }}>
                {results.keywords.map((kw, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{kw.keyword}</span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>
                        Intent: {kw.intent}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: kw.difficulty === 'Low' ? '#10b981' : kw.difficulty === 'Medium' ? '#f59e0b' : '#ef4444' }}>
                        {kw.difficulty} difficulty
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {results.topPages && (
                <div style={{ marginTop: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>Top Ranking Pages</h2>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {results.topPages.map((page, i) => (
                      <div key={i} style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '13px', color: '#6366f1', marginBottom: '4px' }}>#{i + 1} — {page.domain}</div>
                        <div style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '4px' }}>{page.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{page.snippet}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Competitor Analysis */}
          {mode === 'competitors' && results.analysis && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>Competitor Analysis</h2>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.8', margin: 0 }}>{results.analysis}</p>
              </div>
              {results.topPages && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {results.topPages.map((page, i) => (
                    <div key={i} style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                      <div style={{ fontSize: '13px', color: '#6366f1', marginBottom: '4px' }}>#{i + 1} — {page.domain}</div>
                      <div style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '4px' }}>{page.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{page.snippet}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Gaps */}
          {mode === 'gaps' && results.gaps && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>Content Gap Opportunities</h2>
              <div style={{ display: 'grid', gap: '8px' }}>
                {results.gaps.map((gap, i) => (
                  <div key={i} style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>{gap.topic}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>{gap.opportunity}</div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '12px', color: gap.priority === 'High' ? '#10b981' : gap.priority === 'Medium' ? '#f59e0b' : '#64748b', fontWeight: 600 }}>
                        {gap.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}