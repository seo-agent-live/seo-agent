'use client';
import { useState } from 'react';

export default function ClustersPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keyword: `topical cluster for: ${topic}` }) });
      const data = await res.json();
      const lines = (data.article || '').split('\n').filter((l: string) => l.trim()).slice(0, 12);
      setClusters(lines as any);
    } catch { } finally { setLoading(false); }
  };

  const exampleClusters = [
    { pillar: 'SEO Tools', subtopics: ['Best free SEO tools', 'SEO tools for beginners', 'Enterprise SEO platforms', 'AI-powered SEO tools'] },
    { pillar: 'Keyword Research', subtopics: ['Long-tail keyword strategy', 'Keyword difficulty analysis', 'Search intent guide', 'Keyword clustering methods'] },
    { pillar: 'Content Strategy', subtopics: ['Topical authority building', 'Content gap analysis', 'Editorial calendar planning', 'Content refresh strategy'] },
  ];

  return (
    <div style={{ padding: '28px', background: '#161F35', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>Topic Clusters</h1>
        <p style={{ fontSize: '13px', color: '#7B8DB0' }}>Build topical authority by mapping pillar pages and supporting content.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter a main topic e.g. SEO tools..." style={{ flex: 1, padding: '10px 14px', background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '8px', color: '#E8EDF8', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={handleGenerate} disabled={loading} style={{ padding: '10px 20px', background: '#4F7CFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>{loading ? 'Generating...' : 'Generate Clusters'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {exampleClusters.map((cluster, i) => (
          <div key={i} style={{ background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F7CFF' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8' }}>{cluster.pillar}</span>
              <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '10px', background: 'rgba(79,124,255,0.15)', color: '#4F7CFF', marginLeft: 'auto' }}>Pillar</span>
            </div>
            {cluster.subtopics.map((sub, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderTop: '1px solid #1E2D5A' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1DB8A0', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#7B8DB0' }}>{sub}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}