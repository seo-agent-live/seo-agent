'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ClustersPage() {
  const [topic, setTopic]     = useState('');
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('clusters')
        .select('id, pillar, subtopics, created_at')
        .order('created_at', { ascending: false });
      setClusters(data ?? []);
      setDbLoading(false);
    }
    load();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/clusters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json();
      if (data) {
        // Refresh from DB after generating
        const { data: fresh } = await supabase
          .from('clusters')
          .select('id, pillar, subtopics, created_at')
          .order('created_at', { ascending: false });
        setClusters(fresh ?? []);
        setTopic('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .clusters-page { background: #0d0f14; min-height: 100vh; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 60px; position: relative; }
        .clusters-page::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
        .inner { position: relative; z-index: 1; max-width: 1100px; }
        .topic-input { flex: 1; padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #f1f5f9; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .topic-input:focus { border-color: rgba(124,111,255,0.5); box-shadow: 0 0 0 3px rgba(124,111,255,0.08); }
        .topic-input::placeholder { color: #334155; }
        .gen-btn { padding: 12px 22px; background: #7c6fff; border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; white-space: nowrap; }
        .gen-btn:hover:not(:disabled) { background: #6d5ff0; }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cluster-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; transition: border-color 0.2s, background 0.2s; }
        .cluster-card:hover { background: rgba(255,255,255,0.038); border-color: rgba(124,111,255,0.2); }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 8px; animation: shimmer 1.5s ease infinite; }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.3s ease; }
      `}</style>

      <div className="clusters-page">
        <div className="inner">

          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '5px' }}>Topic Clusters</h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>Build topical authority by mapping pillar pages and supporting content.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
            <input
              className="topic-input"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="Enter a main topic e.g. SEO tools..."
            />
            <button className="gen-btn" onClick={handleGenerate} disabled={loading || !topic.trim()}>
              {loading ? 'Generating…' : 'Generate Clusters'}
            </button>
          </div>

          {dbLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '14px' }} />)}
            </div>
          ) : clusters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155', fontSize: '14px' }}>
              No clusters yet. Enter a topic above to generate your first one!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {clusters.map((cluster) => {
                const subtopics = Array.isArray(cluster.subtopics)
                  ? cluster.subtopics
                  : typeof cluster.subtopics === 'string'
                    ? cluster.subtopics.split('\n').filter(Boolean)
                    : [];
                return (
                  <div className="cluster-card fade-up" key={cluster.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c6fff', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{cluster.pillar}</span>
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '10px', background: 'rgba(124,111,255,0.15)', color: '#a78bfa', marginLeft: 'auto', whiteSpace: 'nowrap' }}>Pillar</span>
                    </div>
                    {subtopics.map((sub: string, j: number) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#475569' }}>{sub}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}