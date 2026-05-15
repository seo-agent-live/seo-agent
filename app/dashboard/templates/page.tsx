'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Sparkles, Clock, ChevronRight, Search } from 'lucide-react';

const S = {
  bg: '#0d1117',
  card: 'rgba(255,255,255,0.025)',
  border: 'rgba(255,255,255,0.07)',
  accent: '#7c6fff',
  text: '#f1f5f9',
  muted: '#475569',
};

const card = { background: S.card, border: `1px solid ${S.border}`, borderRadius: '12px' };
const inp  = { background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: S.text, outline: 'none', width: '100%' };
const btnP = (disabled) => ({ background: disabled ? 'rgba(124,111,255,0.4)' : S.accent, border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '500', color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' });

const CATEGORIES = ['All', 'Blog Post', 'Landing Page', 'Product Review', 'How-To Guide', 'Listicle', 'Case Study', 'Email'];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [selected, setSelected]     = useState(null);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic]           = useState('');
  const [result, setResult]         = useState('');
  const [error, setError]           = useState('');

  useEffect(() => { fetchTemplates(); }, []);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const r = await fetch('/api/templates');
      const d = await r.json();
      setTemplates(d.templates ?? []);
    } catch { setError('Failed to load templates.'); }
    finally { setLoading(false); }
  }

  async function generateFromTemplate() {
    if (!selected || !topic.trim()) return;
    setGenerating(true); setResult(''); setError('');
    try {
      const r = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selected.id, topic: topic.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d.content ?? '');
    } catch (e) { setError(e.message); }
    finally { setGenerating(false); }
  }

  async function saveToLibrary() {
    if (!result) return;
    try {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic, content: result, status: 'Draft' }),
      });
      router.push('/dashboard/library');
    } catch { setError('Failed to save article.'); }
  }

  const filtered = templates.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: S.bg, color: S.text }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
        <p style={{ fontSize: '12px', color: S.muted, margin: 0 }}>
          <span style={{ color: S.text }}>RankFlow</span>
          <span style={{ margin: '0 6px', color: S.border }}>/</span>
          Content Templates
        </p>
      </header>

      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: S.text, marginBottom: '4px' }}>Content Templates</h1>
          <p style={{ fontSize: '13px', color: S.muted, margin: 0 }}>Pick a template and generate SEO-optimized content instantly with AI.</p>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '12px', padding: '10px 14px', borderRadius: '8px' }}>{error}</div>}

        {/* If a template is selected, show generator */}
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => { setSelected(null); setResult(''); setTopic(''); }}
                style={{ background: 'none', border: `1px solid ${S.border}`, borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: S.muted, cursor: 'pointer' }}>
                ← Back
              </button>
              <div style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(124,111,255,0.15)', color: S.accent, fontSize: '11px', fontWeight: '500' }}>
                {selected.name}
              </div>
            </div>

            <div style={{ ...card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color={S.accent} />
                <h2 style={{ fontSize: '14px', fontWeight: '600', color: S.text, margin: 0 }}>Generate with AI</h2>
              </div>
              <p style={{ fontSize: '12px', color: S.muted, margin: 0 }}>{selected.description}</p>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.07em', color: S.muted, display: 'block', marginBottom: '6px' }}>Your Topic</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateFromTemplate()}
                  placeholder={selected.placeholder ?? 'Enter your topic or keyword...'}
                  style={inp} />
              </div>
              <button onClick={generateFromTemplate} disabled={generating || !topic.trim()} style={btnP(generating || !topic.trim())}>
                {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {generating ? 'Generating...' : 'Generate Content'}
              </button>
            </div>

            {generating && (
              <div style={{ ...card, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Loader2 size={20} color={S.accent} className="animate-spin" />
                <span style={{ fontSize: '13px', color: S.muted }}>Generating your content...</span>
              </div>
            )}

            {result && (
              <div style={{ ...card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: S.text, margin: 0 }}>Generated Content</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigator.clipboard.writeText(result)}
                      style={{ padding: '5px 12px', background: 'none', border: `1px solid ${S.border}`, borderRadius: '6px', fontSize: '11px', color: S.muted, cursor: 'pointer' }}>
                      Copy
                    </button>
                    <button onClick={saveToLibrary}
                      style={{ padding: '5px 12px', background: 'rgba(124,111,255,0.15)', border: '1px solid rgba(124,111,255,0.2)', borderRadius: '6px', fontSize: '11px', color: S.accent, cursor: 'pointer', fontWeight: '500' }}>
                      Save to Library
                    </button>
                  </div>
                </div>
                <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                  <pre style={{ fontSize: '13px', color: S.text, lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{result}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search + filter */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border}`, borderRadius: '8px', padding: '8px 12px' }}>
                <Search size={13} color={S.muted} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
                  style={{ flex: 1, background: 'none', border: 'none', fontSize: '13px', color: S.text, outline: 'none' }} />
              </div>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', border: 'none', cursor: 'pointer', background: category === cat ? 'rgba(124,111,255,0.2)' : 'rgba(255,255,255,0.04)', color: category === cat ? S.accent : S.muted }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                {[...Array(6)].map((_, i) => <div key={i} style={{ height: '130px', borderRadius: '12px', background: S.card }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center' }}>
                <FileText size={28} color={S.muted} style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '14px', color: S.muted }}>No templates found</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                {filtered.map(t => (
                  <div key={t.id} onClick={() => setSelected(t)}
                    style={{ ...card, padding: '18px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,111,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = S.border}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(124,111,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {t.icon ?? '📄'}
                      </div>
                      <ChevronRight size={14} color={S.muted} />
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: S.text, margin: '0 0 4px' }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: S.muted, margin: '0 0 10px', lineHeight: '1.5' }}>{t.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '500', padding: '2px 7px', borderRadius: '20px', background: 'rgba(124,111,255,0.12)', color: S.accent }}>{t.category ?? 'General'}</span>
                      {t.estimatedTime && (
                        <span style={{ fontSize: '11px', color: S.muted, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} /> {t.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}