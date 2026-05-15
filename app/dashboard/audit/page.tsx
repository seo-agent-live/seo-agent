'use client';
import { useState } from 'react';

export default function SiteAuditPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [audited, setAudited] = useState(false);

  const issues = [
    { type: 'Critical', label: 'Missing meta descriptions', count: 12, color: '#E24B4A' },
    { type: 'Critical', label: 'Broken internal links', count: 3, color: '#E24B4A' },
    { type: 'Warning', label: 'Images missing alt text', count: 28, color: '#F59E0B' },
    { type: 'Warning', label: 'Slow page load speed', count: 7, color: '#F59E0B' },
    { type: 'Warning', label: 'Duplicate title tags', count: 5, color: '#F59E0B' },
    { type: 'Info', label: 'Pages without H1 tag', count: 4, color: '#4F7CFF' },
    { type: 'Info', label: 'Thin content pages', count: 9, color: '#4F7CFF' },
    { type: 'Good', label: 'Properly indexed pages', count: 143, color: '#1DB8A0' },
  ];

  const handleAudit = () => {
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAudited(true); }, 2000);
  };

  return (
    <div style={{ padding: '28px', background: '#161F35', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>Site Audit</h1>
        <p style={{ fontSize: '13px', color: '#7B8DB0' }}>Scan your website for SEO issues and get actionable recommendations.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yoursite.com" style={{ flex: 1, padding: '10px 14px', background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '8px', color: '#E8EDF8', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={handleAudit} disabled={loading} style={{ padding: '10px 24px', background: '#4F7CFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>{loading ? 'Scanning...' : 'Run Audit'}</button>
      </div>
      {audited && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' }}>
            {[{ label: 'Health Score', value: '72', color: '#F59E0B' }, { label: 'Issues Found', value: '68', color: '#E24B4A' }, { label: 'Warnings', value: '40', color: '#F59E0B' }, { label: 'Pages Scanned', value: '186', color: '#1DB8A0' }].map(s => (
              <div key={s.label} style={{ background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '12px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#7B8DB0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E2D5A' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>Issues Found</span>
            </div>
            {issues.map((issue, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: i < issues.length - 1 ? '1px solid #1E2D5A' : 'none' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '10px', background: issue.color + '18', color: issue.color, width: '60px', textAlign: 'center', flexShrink: 0 }}>{issue.type}</span>
                <span style={{ fontSize: '13px', color: '#E8EDF8', flex: 1 }}>{issue.label}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: issue.color }}>{issue.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {!audited && !loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7B8DB0', fontSize: '13px' }}>Enter your website URL above and click Run Audit to get started</div>
      )}
    </div>
  );
}