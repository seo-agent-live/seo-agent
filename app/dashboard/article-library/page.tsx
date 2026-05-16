'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  published: { bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
  draft:     { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
  failed:    { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
};

const scoreColor = (s: number) => s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : '#f87171';
const scoreBg    = (s: number) => s >= 80 ? 'rgba(52,211,153,0.12)' : s >= 60 ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)';

export default function ArticleLibraryPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, seo_score, status, created_at')
      .order('created_at', { ascending: false });
    if (!error) setArticles(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('articles').delete().eq('id', id);
    setArticles(prev => prev.filter(a => a.id !== id));
    setSelected(prev => prev.filter(s => s !== id));
    setDeleting(null);
  };

  const handleDeleteSelected = async () => {
    for (const id of selected) await supabase.from('articles').delete().eq('id', id);
    setArticles(prev => prev.filter(a => !selected.includes(a.id)));
    setSelected([]);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('articles').update({ status }).eq('id', id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const filtered = articles.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status?.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       articles.length,
    published: articles.filter(a => a.status?.toLowerCase() === 'published').length,
    draft:     articles.filter(a => a.status?.toLowerCase() === 'draft').length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .lib-root { min-height: 100vh; background: #0d0f14; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 64px; position: relative; }
        .lib-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .inner { position: relative; z-index: 1; max-width: 1000px; }
        .glass { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px; }
        .search-input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #f1f5f9; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 240px; }
        .search-input:focus { border-color: rgba(124,111,255,0.5); box-shadow: 0 0 0 3px rgba(124,111,255,0.08); }
        .search-input::placeholder { color: #334155; }
        .filter-btn { padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.07); background: transparent; color: #475569; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .filter-btn.active { background: rgba(124,111,255,0.15); border-color: rgba(124,111,255,0.3); color: #a78bfa; }
        .filter-btn:hover:not(.active) { background: rgba(255,255,255,0.04); color: #94a3b8; }
        .article-row { display: grid; grid-template-columns: 32px 1fr 70px 100px 110px 80px; gap: 12px; align-items: center; padding: 12px 14px; border-radius: 9px; background: rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.04); transition: background 0.15s, border-color 0.15s; }
        .article-row:hover { background: rgba(124,111,255,0.05); border-color: rgba(124,111,255,0.12); }
        .del-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid rgba(248,113,113,0.2); background: rgba(248,113,113,0.08); color: #f87171; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .del-btn:hover { background: rgba(248,113,113,0.18); }
        .del-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .status-select { background: transparent; border: none; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; outline: none; padding: 3px 8px; border-radius: 5px; }
        .bulk-del-btn { padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(248,113,113,0.2); background: rgba(248,113,113,0.08); color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .bulk-del-btn:hover { background: rgba(248,113,113,0.18); }
        .checkbox { width: 16px; height: 16px; accent-color: #7c6fff; cursor: pointer; }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 6px; animation: shimmer 1.5s ease infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.25s ease; }
      `}</style>

      <div className="lib-root">
        <div className="inner">
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '5px' }}>Article Library</h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>All your generated articles in one place.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Total Articles', value: counts.all,       color: '#7c6fff' },
              { label: 'Published',      value: counts.published, color: '#34d399' },
              { label: 'Drafts',         value: counts.draft,     color: '#fbbf24' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px 22px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>{s.label}</div>
                {loading
                  ? <div className="skeleton" style={{ width: '50px', height: '26px' }} />
                  : <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
                }
              </div>
            ))}
          </div>

          <div className="glass" style={{ marginBottom: '12px', padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'published', 'draft'].map(f => (
                  <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f as keyof typeof counts] ?? 0})
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {selected.length > 0 && (
                  <button className="bulk-del-btn fade-up" onClick={handleDeleteSelected}>
                    Delete {selected.length} selected
                  </button>
                )}
                <input className="search-input" placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 70px 100px 110px 80px', gap: '12px', padding: '4px 14px', marginBottom: '8px' }}>
              {['', 'Title', 'Score', 'Status', 'Date', ''].map((h, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '50px', borderRadius: '9px' }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>
                {search ? `No articles matching "${search}"` : 'No articles yet. Generate some first!'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {filtered.map(a => {
                  const st = (a.status ?? 'draft').toLowerCase();
                  const stStyle = STATUS_COLORS[st] ?? STATUS_COLORS.draft;
                  return (
                    <div className="article-row fade-up" key={a.id}>
                      <input type="checkbox" className="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                      </div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: scoreBg(a.seo_score ?? 0), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: scoreColor(a.seo_score ?? 0) }}>{a.seo_score ?? '—'}</span>
                      </div>
                      <div style={{ background: stStyle.bg, borderRadius: '6px' }}>
                        <select className="status-select" value={st} style={{ color: stStyle.color, background: 'transparent' }} onChange={e => handleStatusChange(a.id, e.target.value)}>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <button className="del-btn" disabled={deleting === a.id} onClick={() => handleDelete(a.id)}>
                        {deleting === a.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}