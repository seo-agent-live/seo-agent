'use client';
import { useState } from 'react';

export default function BulkGeneratePage() {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const lines = keywords.split('\n').filter(k => k.trim()).slice(0, 10);

  const handleBulk = async () => {
    if (!lines.length) return;
    setLoading(true);
    setResults([]);
    setProgress(0);
    setCurrentKeyword('');
    const generated = [];
    for (let i = 0; i < lines.length; i++) {
      const kw = lines[i].trim();
      setCurrentKeyword(kw);
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: kw }),
        });
        const data = await res.json();
        generated.push({ keyword: kw, status: 'Done', words: data.article?.split(' ').length ?? 0 });
      } catch {
        generated.push({ keyword: kw, status: 'Failed', words: 0 });
      }
      setProgress(Math.round(((i + 1) / lines.length) * 100));
      setResults([...generated]);
    }
    setCurrentKeyword('');
    setLoading(false);
  };

  const done   = results.filter(r => r.status === 'Done').length;
  const failed = results.filter(r => r.status === 'Failed').length;

  return (
    <>
      <style>{`
        .bulk-textarea { transition: border-color 0.15s; }
        .bulk-textarea:focus { border-color: rgba(124,111,255,0.5) !important; box-shadow: 0 0 0 3px rgba(124,111,255,0.08); outline: none; }
        .bulk-textarea::placeholder { color: #334155; }
        .bulk-btn:hover:not(:disabled) { background: #6d5ff0 !important; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        .result-row { animation: slideIn 0.2s ease; }
      `}</style>

      <div style={{ color: '#e2e8f0', fontFamily: "'Inter', sans-serif", maxWidth: '960px' }}>

        {/* Header */}
        <div style={{ marginBottom: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px', margin: 0 }}>
              Bulk Generate
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
              Pro
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
            Generate multiple articles at once — one keyword per line, up to 10.
          </p>
        </div>

        {/* Two-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Left — Input */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Keywords</span>
              <span style={{ fontSize: '12px', color: lines.length >= 10 ? '#fbbf24' : '#334155' }}>
                {lines.length} / 10
              </span>
            </div>

            <textarea
              className="bulk-textarea"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder={'best seo tools 2025\nhow to rank on google\nkeyword research guide'}
              rows={11}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                color: '#f1f5f9',
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'none',
                boxSizing: 'border-box',
                lineHeight: '1.7',
              }}
            />

            {/* Progress bar */}
            {loading && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ fontSize: '12px', color: '#475569', animation: 'pulse 1.5s ease infinite' }}>
                    Generating "{currentKeyword}"...
                  </span>
                  <span style={{ fontSize: '12px', color: '#7c6fff', fontWeight: 600 }}>{progress}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: '#7c6fff', borderRadius: '6px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            )}

            <button
              className="bulk-btn"
              onClick={handleBulk}
              disabled={loading || !lines.length}
              style={{
                padding: '11px',
                background: loading || !lines.length ? 'rgba(124,111,255,0.3)' : '#7c6fff',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading || !lines.length ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: !lines.length ? 0.5 : 1,
                transition: 'background 0.15s',
              }}
            >
              {loading ? `Generating… ${progress}%` : '⚡ Bulk Generate'}
            </button>
          </div>

          {/* Right — Results */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Results</span>
              {results.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {done > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '5px', background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                      {done} done
                    </span>
                  )}
                  {failed > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '5px', background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                      {failed} failed
                    </span>
                  )}
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: '#334155', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', opacity: 0.3, marginBottom: '12px' }}>⚡</div>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '5px' }}>Results will appear here</p>
                <p style={{ fontSize: '12px', color: '#334155' }}>Enter keywords and click Bulk Generate</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="result-row"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{
                      width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                      background: r.status === 'Done' ? '#34d399' : '#f87171',
                    }} />
                    <span style={{ fontSize: '13px', color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.keyword}
                    </span>
                    {r.words > 0 && (
                      <span style={{ fontSize: '11px', color: '#334155', flexShrink: 0 }}>
                        {r.words.toLocaleString()} words
                      </span>
                    )}
                    <span style={{
                      fontSize: '11px', fontWeight: 700, flexShrink: 0,
                      padding: '2px 8px', borderRadius: '5px',
                      background: r.status === 'Done' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
                      color: r.status === 'Done' ? '#34d399' : '#f87171',
                    }}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}