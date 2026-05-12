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

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/audit/history');
      const data = await res.json();
      setHistory(data.audits || []);
    } catch (err) {
      console.error(err);
    }
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

  const scoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const scoreBg = (score) => score >= 80 ? 'rgba(16,185,129,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Site Audit
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Audit any page or site for SEO issues, meta tags, and performance.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[{ id: 'audit', label: '🔍 Run Audit' }, { id: 'history', label: '📋 Audit History' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid', borderColor: activeTab === tab.id ? '#6366f1' : 'rgba(255,255,255,0.1)', background: activeTab === tab.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: activeTab === tab.id ? '#a5b4fc' : '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'audit' && (
        <div>
          {/* Input */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Enter URL to Audit</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAudit()}
                placeholder='https://yoursite.com or https://yoursite.com/page'
                style={{ flex: 1, padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={handleAudit} disabled={loading || !url.trim()} style={{ padding: '12px 24px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {loading ? 'Auditing...' : 'Run Audit →'}
              </button>
            </div>
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
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <p>Running full site audit...</p>
              <p style={{ fontSize: '13px' }}>Checking meta tags, headings, speed, and more...</p>
            </div>
          )}

          {/* Results */}
          {audit && !loading && (
            <div>
              {/* Score */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Overall Score', value: audit.overallScore, suffix: '/100' },
                  { label: 'Meta Tags', value: audit.metaScore, suffix: '/100' },
                  { label: 'Performance', value: audit.performanceScore, suffix: '/100' },
                  { label: 'Issues Found', value: audit.issues?.length || 0, suffix: '' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '20px', background: scoreBg(s.value), border: `1px solid ${scoreColor(s.value)}30`, borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: scoreColor(s.value), marginBottom: '4px' }}>{s.value}{s.suffix}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Meta Tags */}
              {audit.metaTags && (
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' }}>🏷️ Meta Tags</h3>
                  {Object.entries(audit.metaTags).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                      <span style={{ color: '#6366f1', fontWeight: 600, minWidth: '140px' }}>{key}</span>
                      <span style={{ color: '#94a3b8' }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Issues & Recommendations */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>⚠️ Issues</h3>
                  {audit.issues?.map((issue, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {issue}</div>
                  ))}
                </div>
                <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#10b981', marginBottom: '12px' }}>✅ Recommendations</h3>
                  {audit.recommendations?.map((rec, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {rec}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Past Audits</h2>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
              <p>No audits yet. Run your first audit!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>{h.url}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{new Date(h.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: scoreColor(h.score) }}>{h.score}/100</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}