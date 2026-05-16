'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function BulkGeneratePage() {
  const [keywords, setKeywords]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [progress, setProgress]           = useState(0);
  const [results, setResults]             = useState<any[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const lines = keywords.split('\n').filter(k => k.trim()).slice(0, 10);

  const handleBulk = async () => {
    if (!lines.length) return;
    setLoading(true);
    setResults([]);
    setProgress(0);
    setCurrentKeyword('');

    const generated: any[] = [];

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
        const wordCount = data.article?.split(' ').length ?? 0;

        // Save to Supabase
        await supabase.from('articles').insert({
          title:     kw,
          content:   data.article ?? '',
          status:    'draft',
          seo_score: null,
          word_count: wordCount,
        });

        generated.push({ keyword: kw, status: 'Done', words: wordCount });
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .bulk-page { background: #0d0f14; min-height: 100vh; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 60px; position: relative; }
        .bulk-page::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
        .inner { position: relative; z-index: 1; max-width: 960px; }
        .bulk-textarea { width: 100%; padding: 12px 14px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: #f1f5f9; font-size: 13px; font-family: 'Inter', sans-serif; resize: none; line-height: 1.7; transition: border-color 0.15s, box-shadow 0.15s; outline: none; }
        .bulk-textarea:focus { border-color: rgba(124,111,255,0.5); box-shadow: 0 0 0 3px rgba(124,111,255,0.08); }
        .bulk-textarea::placeholder { color: #334155; }
        .bulk-btn { padding: 11px; background: #7c6fff; border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; width: 100%; }
        .bulk-btn:hover:not(:disabled) { background: #6d5ff0; }
        .bulk-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .glass { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .result-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; animation: slideIn 0.2s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="bulk-page">
        <div className="inner">

          {/* Header */}
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', margin: 0 }}>Bulk Generate</h1>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>Pro</span>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>Generate multiple SEO articles at once — one keyword per line, up to 10.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Left — Input */}
            <div className="glass">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Keywords</span>
                <span style={{ fontSize: '12px', color: lines.length >= 10 ? '#fbbf24' : '#334155' }}>{lines.length} / 10</span>
              </div>

              <textarea
                className="bulk-textarea"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder={'best seo tools 2025\nhow to rank on google\nkeyword research guide'}
                rows={11}
              />

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

              <button className="bulk-btn" onClick={handleBulk} disabled={loading || !lines.length}>
                {loading ? `Generating… ${progress}%` : '⚡ Bulk Generate'}
              </button>
            </div>

            {/* Right — Results */}
            <div className="glass">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Results</span>
                {results.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {done > 0 && <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '5px', background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>{done} done</span>}
                    {failed > 0 && <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '5px', background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>{failed} failed</span>}
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', opacity: 0.3, marginBottom: '12px' }}>⚡</div>
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '5px' }}>Results will appear here</p>
                  <p style={{ fontSize: '12px', color: '#334155' }}>Enter keywords and click Bulk Generate</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {results.map((r, i) => (
                    <div className="result-row" key={i}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, background: r.status === 'Done' ? '#34d399' : '#f87171' }} />
                      <span style={{ fontSize: '13px', color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.keyword}</span>
                      {r.words > 0 && <span style={{ fontSize: '11px', color: '#334155', flexShrink: 0 }}>{r.words.toLocaleString()} words</span>}
                      <span style={{ fontSize: '11px', fontWeight: 700, flexShrink: 0, padding: '2px 8px', borderRadius: '5px', background: r.status === 'Done' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', color: r.status === 'Done' ? '#34d399' : '#f87171' }}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}