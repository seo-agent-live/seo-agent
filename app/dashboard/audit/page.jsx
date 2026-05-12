'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SiteAuditPage() {
  const { user } = useUser();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('audit');

  useEffect(() => { if (user) fetchHistory(); }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/audit/history');
      const data = await res.json();
      setHistory(data.audits || []);
    } catch (err) { console.error(err); }
  };

  const handleAudit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setAudit(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userId: user?.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAudit(data);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Site Audit</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Audit any page for SEO issues.</p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['audit', 'history'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid', borderColor: activeTab === tab ? '#6366f1' : 'rgba(255,255,255,0.1)', background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent', color: activeTab === tab ? '#a5b4fc' : '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            {tab === 'audit' ? 'Run Audit' : 'History'}
          </button>
        ))}
      </div>
      {activeTab === 'audit' && (
        <div>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Enter URL to Audit</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yoursite.com" style={{ flex: 1, padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={handleAudit} disabled={loading} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Auditing...' : 'Run Audit'}
              </button>
            </div>
          </div>
          {error && <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', marginBottom: '16px' }}>{error}</div>}
          {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>🔍 Analyzing...</div>}
          {audit && !loading && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[{ label: 'Overall', value: audit.overallScore }, { label: 'Meta', value: audit.metaScore }, { label: 'Performance', value: audit.performanceScore }].map((s, i) => (
                  <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: scoreColor(s.value) }}>{s.value}/100</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {audit.metaTags && (
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' }}>Meta Tags</h3>
                  {Object.entries(audit.metaTags).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                      <span style={{ color: '#6366f1', fontWeight: 600, minWidth: '140px' }}>{key}</span>
                      <span style={{ color: '#94a3b8' }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '14px' }}>
                  <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>Issues</h3>
                  {audit.issues?.map((x, i) => <div key={i} style={{ color: '#94a3b8', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {x}</div>)}
                </div>
                <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px' }}>
                  <h3 style={{ color: '#10b981', marginBottom: '12px' }}>Recommendations</h3>
                  {audit.recommendations?.map((x, i) => <div key={i} style={{ color: '#94a3b8', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {x}</div>)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'history' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Past Audits</h2>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>No audits yet.</div>
          ) : (
            history.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', marginBottom: '8px' }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontSize: '14px' }}>{h.url}</div>
                  <div style={{ color: '#475569', fontSize: '12px' }}>{new Date(h.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ color: scoreColor(h.score), fontWeight: 700, fontSize: '20px' }}>{h.score}/100</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}