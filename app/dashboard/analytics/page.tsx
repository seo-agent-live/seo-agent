'use client';
import { useState } from 'react';

const mockData = {
  overview: [
    { label: 'Total Articles', value: '24', change: '+3 this week', color: '#6366f1' },
    { label: 'Avg SEO Score', value: '76', change: '+5 from last week', color: '#10b981' },
    { label: 'Keywords Tracked', value: '48', change: '+12 this month', color: '#f59e0b' },
    { label: 'Organic Traffic', value: '2.4k', change: '+18% this month', color: '#ec4899' },
  ],
  recentArticles: [
    { title: 'Best SEO Tools for Small Business', score: 88, status: 'Published', date: 'May 8' },
    { title: 'How to Do Keyword Research', score: 74, status: 'Draft', date: 'May 6' },
    { title: 'Content Marketing Strategy Guide', score: 91, status: 'Published', date: 'May 4' },
    { title: 'On-Page SEO Checklist', score: 65, status: 'Draft', date: 'May 2' },
    { title: 'Link Building for Beginners', score: 82, status: 'Published', date: 'Apr 30' },
  ],
};

export default function AnalyticsPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        SEO Analytics
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Analyze any URL and track your content performance.
      </p>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {mockData.overview.map((item, i) => (
          <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.value}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '12px', color: '#10b981' }}>{item.change}</div>
          </div>
        ))}
      </div>

      {/* URL Analyzer */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Analyze a URL</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            placeholder='https://yoursite.com/blog/your-article'
            style={{ flex: 1, padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          <button onClick={handleAnalyze} disabled={loading || !url.trim()} style={{ padding: '12px 24px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {loading ? 'Analyzing...' : 'Analyze →'}
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
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
          <p>Analyzing your page...</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Analysis Results</h2>

          {/* Score */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            {[
              { label: 'Overall SEO Score', value: analysis.seoScore, suffix: '/100' },
              { label: 'Readability Score', value: analysis.readabilityScore, suffix: '/100' },
              { label: 'Keyword Density', value: analysis.keywordDensity, suffix: '%' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: scoreColor(s.value), marginBottom: '4px' }}>{s.value}{s.suffix}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Issues & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>⚠️ Issues Found</h3>
              {analysis.issues?.map((issue, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {issue}</div>
              ))}
            </div>
            <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#10b981', marginBottom: '12px' }}>✅ Recommendations</h3>
              {analysis.recommendations?.map((rec, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>• {rec}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Articles */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Recent Articles</h2>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          {mockData.recentArticles.map((article, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < mockData.recentArticles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>{article.title}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{article.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: article.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: article.status === 'Published' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                  {article.status}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: scoreColor(article.score) }}>{article.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}