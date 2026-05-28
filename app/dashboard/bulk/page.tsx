'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BulkGeneratePage() {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  const keywordList = keywords.split('\n').map(k => k.trim()).filter(Boolean);

  const handleGenerate = async () => {
    if (!keywordList.length) return;
    setLoading(true);
    setResults([]);
    setProgress(0);
    setSaveMessage('');

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

        const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const titleMatch = data.content?.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : keyword;

        await supabase.from('articles').insert({
          title,
          content: data.content ?? '',
          keyword,
          slug,
          status: 'Published',
          seo_score: data.seoScore ?? 75,
          word_count: data.wordCount ?? 0,
          read_time: data.readTime ?? '',
          meta_description: data.metaDescription ?? '',
        });

        generated.push({ keyword, ...data, status: 'done' });
      } catch (err) {
        generated.push({ keyword, status: 'error' });
      }

      setProgress(Math.round(((i + 1) / keywordList.length) * 100));
      setResults([...generated]);
    }

    setLoading(false);

    const doneCount = generated.filter(r => r.status === 'done').length;
    if (doneCount > 0) {
      setSaveMessage(doneCount + ' article' + (doneCount > 1 ? 's' : '') + ' saved to Article Library!');
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Geist, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Bulk Generate</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Generate multiple SEO articles at once.</p>

      {saveMessage && (
        <div style={{ padding: '12px 18px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '10px', color: '#34d399', fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✅ {saveMessage}
          <a href="/dashboard/article-library" style={{ marginLeft: 'auto', color: '#34d399', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
            View in Article Library →
          </a>
        </div>
      )}

      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Keywords (one per line)</label>
        <textarea value={keywords} onChange={e => setKeywords(e.target.value)} placeholder={'best SEO tools'} rows={6} style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
          <select value={tone} onChange={e => setTone(e.target.value)} style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'inherit' }}>
            <option value="professional" style={{ background: '#1a1740' }}>Professional</option>
            <option value="casual" style={{ background: '#1a1740' }}>Casual</option>
          </select>
          <select value={length} onChange={e => setLength(e.target.value)} style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'inherit' }}>
            <option value="short" style={{ background: '#1a1740' }}>Short</option>
            <option value="medium" style={{ background: '#1a1740' }}>Medium</option>
            <option value="long" style={{ background: '#1a1740' }}>Long</option>
          </select>
        </div>
        <button onClick={handleGenerate} disabled={loading || !keywordList.length} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {loading ? 'Generating... ' + progress + '%' : 'Generate Articles'}
        </button>
      </div>

      {results.length > 0 && results.map((r, i) => (
        <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', marginBottom: '8px' }}>
          <span style={{ color: '#e2e9f1', fontWeight: 600 }}>{r.status === 'done' ? '✅' : '❌'} {r.keyword}</span>
        </div>
      ))}
    </div>
  );
}