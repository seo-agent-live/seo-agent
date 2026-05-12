'use client';
import { useState } from 'react';

export default function BulkGeneratePage() {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const keywordList = keywords.split('\n').map(k => k.trim()).filter(Boolean);

  const handleGenerate = async () => {
    if (!keywordList.length) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setProgress(0);
    const generated = [];
    for (let i = 0; i < keywordList.length; i++) {
      const keyword = keywordList[i];
      try {
        const res = await fetch('/api/writer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, tone, length }),
        });
        const data = await res.json();
        generated.push({ keyword, ...data, status: 'done' });
      } catch (err) {
        generated.push({ keyword, status: 'error', error: err.message });
      }
      setProgress(Math.round(((i + 1) / keywordList.length) * 100));
      setResults([...generated]);
    }
    setLoading(false);
  };

  const handleDownloadAll = () => {
    const text = results.filter(r => r.status === 'done').map(r => `# ${r.keyword}\n\n${r.content}`).join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-articles.txt';
    a.click();
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bulk Generate</h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>Generate multiple SEO articles at once. Enter one keyword per line.</p>
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Keywords (one per line) — {keywordList.length} entered</label>
          <textarea value={keywords} onChange={e => setKeywords(e.target.value)} placeholder={'best SEO tools\ncontent marketing strategy\nhow to rank on Google'} rows={6} style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="professional" style={{ background: '#1a1740' }}>Professional</option>
              <option value="casual" style={{ background: '#1a1740' }}>Casual</option>
              <option value="authoritative" style={{ background: '#1a1740' }}>Authoritative</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Length</label>
            <select value={length} onChange={e => setLength(e.target.value)} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="short" style={{ background: '#1a1740' }}>Short (500-800 words)</option>
              <option value="medium" style={{ background: '#1a1740' }}>Medium (1000-1500 words)</option>
              <option value="long" style={{ background: '#1a1740' }}>Long (2000+ words)</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading || !keywordList.length} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {loading ? `Generating... (${progress}%)` : `Generate ${keywordList.length} Article${keywordList.length !== 1 ? 's' : ''}`}
        </button>
        {loading && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}
      </div>
      {error && <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '14px', marginBottom: '24px' }}>{error}</div>}
      {results.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Generated ({results.filter(r => r.status === 'done').length}/{keywordList.length})</h2>
            {!loading && results.some(r => r.status === 'done') && (
              <button onClick={handleDownloadAll} style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Download All</button>
            )}
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {results.map((r, i) => (
              <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid', borderColor: r.status === 'done' ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.2)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: r.status === 'done' ? '12px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{r.status === 'done' ? '✅' : '❌'}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>{r.keyword}</span>
                  </div>
                  {r.status === 'done' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{r.wordCount} words</span>
                      <button onClick={() => navigator.clipboard.writeText(r.content)} style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', color: '#a5b4fc', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Copy</button>
                    </div>
                  )}
                </div>
                {r.status === 'done' && (
                  <details>
                    <summary style={{ fontSize: '13px', color: '#6366f1', cursor: 'pointer' }}>Preview</summary>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94a3b8', margin: '8px 0 0', lineHeight: '1.7', maxHeight: '300px', overflow: 'auto' }}>{r.content}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
