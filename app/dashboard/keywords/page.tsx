'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [newKw, setNewKw]       = useState('');
  const [adding, setAdding]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchKeywords(); }, []);

  const fetchKeywords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('cluster_keywords')
      .select('id, keyword, intent, created_at, cluster_id')
      .order('created_at', { ascending: false });
    setKeywords(data ?? []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newKw.trim()) return;
    setAdding(true);
    await supabase.from('cluster_keywords').insert({
      keyword:    newKw.trim(),
      user_id:    'default',
      cluster_id: null,
      intent:     'informational',
    });
    setNewKw('');
    await fetchKeywords();
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('cluster_keywords').delete().eq('id', id);
    setKeywords(prev => prev.filter(k => k.id !== id));
    setDeleting(null);
  };

  const intentColor = (intent: string) => {
    switch (intent) {
      case 'commercial':    return { bg: 'rgba(124,111,255,0.12)', color: '#a78bfa' };
      case 'transactional': return { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' };
      case 'navigational':  return { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' };
      default:              return { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa' };
    }
  };

  const filtered = keywords.filter(k =>
    k.keyword?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .kw-page { background: #0d0f14; min-height: 100vh; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 60px; position: relative; }
        .kw-page::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
        .inner { position: relative; z-index: 1; max-width: 1000px; }
        .kw-input { flex: 1; padding: 11px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #f1f5f9; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .kw-input:focus { border-color: rgba(124,111,255,0.5); box-shadow: 0 0 0 3px rgba(124,111,255,0.08); }
        .kw-input::placeholder { color: #334155; }
        .add-btn { padding: 11px 22px; background: #7c6fff; border: none; border-radius: 10px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; white-space: nowrap; }
        .add-btn:hover:not(:disabled) { background: #6d5ff0; }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .glass { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; }
        .kw-row { display: grid; grid-template-columns: 1fr 140px 100px 80px; gap: 12px; align-items: center; padding: 12px 14px; border-radius: 9px; background: rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
        .kw-row:hover { background: rgba(124,111,255,0.05); border-color: rgba(124,111,255,0.12); }
        .del-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid rgba(248,113,113,0.2); background: rgba(248,113,113,0.08); color: #f87171; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .del-btn:hover { background: rgba(248,113,113,0.18); }
        .del-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 6px; animation: shimmer 1.5s ease infinite; }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.25s ease; }
      `}</style>

      <div className="kw-page">
        <div className="inner">

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '5px' }}>Keyword Tracker</h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>Track and manage your target keywords.</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Total Keywords',     value: keywords.length,                                                   color: '#7c6fff' },
              { label: 'Informational',      value: keywords.filter(k => k.intent === 'informational').length,         color: '#60a5fa' },
              { label: 'Commercial',         value: keywords.filter(k => k.intent === 'commercial').length,            color: '#a78bfa' },
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

          {/* Add keyword */}
          <div className="glass" style={{ marginBottom: '14px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                className="kw-input"
                value={newKw}
                onChange={e => setNewKw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Add a keyword to track..."
              />
              <button className="add-btn" onClick={handleAdd} disabled={adding || !newKw.trim()}>
                {adding ? 'Adding…' : '+ Track Keyword'}
              </button>
            </div>
          </div>

          {/* Search + table */}
          <div className="glass">
            <div style={{ marginBottom: '14px' }}>
              <input
                className="kw-input"
                style={{ width: '260px' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search keywords…"
              />
            </div>

            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 80px', gap: '12px', padding: '4px 14px', marginBottom: '8px' }}>
              {['Keyword', 'Intent', 'Added', ''].map((h, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '9px' }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>
                {search ? `No keywords matching "${search}"` : 'No keywords yet. Add one above!'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {filtered.map(k => {
                  const ic = intentColor(k.intent ?? 'informational');
                  return (
                    <div className="kw-row fade-up" key={k.id}>
                      <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {k.keyword}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '6px', background: ic.bg, color: ic.color, display: 'inline-block' }}>
                        {k.intent ?? 'informational'}
                      </span>
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        {new Date(k.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                      <button className="del-btn" disabled={deleting === k.id} onClick={() => handleDelete(k.id)}>
                        {deleting === k.id ? '…' : 'Delete'}
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