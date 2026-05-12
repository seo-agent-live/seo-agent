'use client';
import { useState } from 'react';

export default function WriterPage() {
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('long');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setArticle(null);

    try {
      const res = await fetch('/api/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, tone, length }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setArticle(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        AI Writer
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Generate long-form, SEO-optimized articles with one keyword.
      </p>

      {/* Settings */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Target Keyword *</label>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder='e.g. "best SEO tools for small business"'
            style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="professional" style={{ background: '#1a1740' }}>Professional</option>
              <option value="casual" style={{ background: '#1a1740' }}>Casual</option>
              <option value="authoritative" style={{ background: '#1a1740' }}>Authoritative</option>
              <option value="friendly" style={{ background: '#1a1740' }}>Friendly</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Article Length</label>
            <select value={length} onChange={e => setLength(e.target.value)} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="short" style={{ background: '#1a1740' }}>Short (500-800 words)</option>
              <option value="medium" style={{ background: '#1a1740' }}>Medium (1000-1500 words)</option>
              <option value="long" style={{ background: '#1a1740' }}>Long (2000+ words)</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !keyword.trim()} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {loading ? '✍️ Generating article...' : '✍️ Generate Article'}
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
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✍️</div>
          <p style={{ marginBottom: '8px' }}>Writing your article...</p>
          <p style={{ fontSize: '13px' }}>This may take up to 30 seconds for long articles.</p>
        </div>
      )}

      {/* Article Output */}
      {article && !loading && (
        <div>
          {/* Meta */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Article Ready!</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCopy} style={{ padding: '8px 16px', background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', border: '1px solid', borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.4)', borderRadius: '8px', color: copied ? '#10b981' : '#a5b4fc', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#6366f1' }}>{article.wordCount}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Words</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{article.seoScore}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>SEO Score</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>{article.readTime}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Read Time</div>
              </div>
            </div>
          </div>

          {/* Meta description */}
          {article.metaDescription && (
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, marginBottom: '6px' }}>META DESCRIPTION</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{article.metaDescription}</div>
            </div>
          )}

          {/* Article content */}
          <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', lineHeight: '1.8' }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#cbd5e1', margin: 0 }}>
              {article.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}