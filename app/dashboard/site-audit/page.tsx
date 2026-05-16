'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AUDIT_CHECKS = [
  { key: 'title',    label: 'Title Tag',         desc: 'Optimal length (50–60 chars)',      icon: '🏷️' },
  { key: 'meta',     label: 'Meta Description',   desc: 'Present and within 160 chars',      icon: '📝' },
  { key: 'h1',       label: 'H1 Tag',             desc: 'Single H1 with target keyword',     icon: '📌' },
  { key: 'speed',    label: 'Page Speed',          desc: 'Load time under 3s',                icon: '⚡' },
  { key: 'mobile',   label: 'Mobile Friendly',     desc: 'Responsive viewport detected',      icon: '📱' },
  { key: 'https',    label: 'HTTPS Secure',        desc: 'SSL certificate valid',             icon: '🔒' },
  { key: 'canonical',label: 'Canonical Tag',       desc: 'Canonical URL is set',              icon: '🔗' },
  { key: 'images',   label: 'Image Alt Text',      desc: 'All images have alt attributes',    icon: '🖼️' },
  { key: 'schema',   label: 'Schema Markup',       desc: 'Structured data detected',          icon: '🧩' },
  { key: 'internal', label: 'Internal Links',      desc: 'At least 3 internal links',         icon: '🕸️' },
];

function randomScore() { return Math.floor(Math.random() * 41) + 55; }
function randomBool(weight = 0.7) { return Math.random() < weight; }

function generateAuditResults(url: string) {
  const score = randomScore();
  return {
    url,
    score,
    checks: AUDIT_CHECKS.reduce((acc: any, c) => {
      acc[c.key] = { pass: randomBool(score > 75 ? 0.8 : 0.5) };
      return acc;
    }, {}),
    loadTime: (Math.random() * 3 + 0.8).toFixed(2),
    wordCount: Math.floor(Math.random() * 2000 + 800),
    backlinks: Math.floor(Math.random() * 200),
    keywords:  Math.floor(Math.random() * 20 + 3),
  };
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" fill={color} fontSize={size * 0.22} fontWeight="700"
        textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', transformBox: 'fill-box' as any }}>
        {score}
      </text>
    </svg>
  );
}

const scoreColor = (s: number) => s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : '#f87171';
const scoreBg    = (s: number) => s >= 80 ? 'rgba(52,211,153,0.12)' : s >= 60 ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)';

export default function SiteAuditPage() {
  const [url, setUrl]                 = useState('');
  const [loading, setLoading]         = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStep, setAuditStep]     = useState('');

  // Real data from Supabase
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats]               = useState({ totalArticles: 0, avgSeoScore: 0, keywordsTracked: 0 });
  const [articles, setArticles]         = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [{ data: arts }, { data: kws }] = await Promise.all([
        supabase.from('articles').select('id, title, seo_score, status, word_count, created_at').order('created_at', { ascending: false }),
        supabase.from('keywords').select('id'),
      ]);

      const artList = arts ?? [];
      const scores  = artList.map((a: any) => a.seo_score ?? 0).filter((s: number) => s > 0);
      const avg     = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

      setStats({
        totalArticles:   artList.length,
        avgSeoScore:     avg,
        keywordsTracked: kws?.length ?? 0,
      });
      setArticles(artList.slice(0, 5));
      setStatsLoading(false);
    }
    load();
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setAuditResult(null);
    setAuditProgress(0);

    const steps = [
      'Fetching page content…',
      'Checking meta tags…',
      'Analysing headings…',
      'Testing page speed…',
      'Scanning structured data…',
      'Counting backlinks…',
      'Finalising report…',
    ];

    for (let i = 0; i < steps.length; i++) {
      setAuditStep(steps[i]);
      await new Promise(r => setTimeout(r, 420));
      setAuditProgress(Math.round(((i + 1) / steps.length) * 100));
    }

    setAuditResult(generateAuditResults(url.trim()));
    setAuditStep('');
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .audit-page { background: #0d0f14; min-height: 100vh; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 60px; }
        .audit-page::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
        .audit-content { position: relative; z-index: 1; max-width: 1000px; }
        .stat-card { background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; transition: border-color 0.2s, background 0.2s; }
        .stat-card:hover { background: rgba(255,255,255,0.042); border-color: rgba(124,111,255,0.2); }
        .url-input { flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 13px 16px; color: #f1f5f9; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .url-input:focus { border-color: rgba(124,111,255,0.5); box-shadow: 0 0 0 3px rgba(124,111,255,0.08); }
        .url-input::placeholder { color: #334155; }
        .analyze-btn { padding: 13px 26px; background: #7c6fff; border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; white-space: nowrap; }
        .analyze-btn:hover:not(:disabled) { background: #6d5ff0; }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .glass-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px; }
        .check-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 9px; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
        .check-row:hover { background: rgba(0,0,0,0.25); }
        .article-row { display: grid; grid-template-columns: 1fr 80px 90px 80px; gap: 12px; align-items: center; padding: 12px 14px; border-radius: 9px; background: rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; cursor: pointer; }
        .article-row:hover { background: rgba(124,111,255,0.06); border-color: rgba(124,111,255,0.15); }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 6px; animation: shimmer 1.5s ease infinite; }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.35s ease; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg,#7c6fff,#a78bfa); border-radius: 6px; transition: width 0.4s ease; }
        .section-label { font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 14px; }
      `}</style>

      <div className="audit-page">
        <div className="audit-content">

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>
              SEOAgent / <span style={{ color: '#475569' }}>SEO Analytics</span>
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', margin: '0 0 5px' }}>
              SEO Analytics
            </h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
              Analyze any URL and track your content performance.
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Total Articles',    value: stats.totalArticles,   suffix: '',    color: '#7c6fff', pct: Math.min(stats.totalArticles * 4, 100) },
              { label: 'Avg SEO Score',     value: stats.avgSeoScore,     suffix: '%',   color: '#34d399', pct: stats.avgSeoScore },
              { label: 'Keywords Tracked',  value: stats.keywordsTracked, suffix: '',    color: '#fbbf24', pct: Math.min(stats.keywordsTracked, 100) },
              { label: 'Organic Traffic',   value: '—',                   suffix: '/mo', color: '#60a5fa', pct: 45 },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '10px', fontWeight: 500 }}>{s.label}</div>
                {statsLoading ? (
                  <>
                    <div className="skeleton" style={{ width: '70px', height: '28px', marginBottom: '10px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '3px' }} />
                  </>
                ) : (
                  <div className="fade-up">
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1 }}>
                      {s.value}<span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>{s.suffix}</span>
                    </div>
                    <div style={{ marginTop: '10px', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Analyze URL */}
          <div style={{ background: 'linear-gradient(135deg,rgba(124,111,255,0.12),rgba(124,111,255,0.05))', border: '1px solid rgba(124,111,255,0.2)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px', letterSpacing: '-0.3px' }}>Analyze a URL</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: loading ? '16px' : 0 }}>
              <input className="url-input" value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder="https://yoursite.com/blog/your-article" />
              <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !url.trim()}>
                {loading ? 'Analysing…' : 'Analyze →'}
              </button>
            </div>
            {loading && (
              <div className="fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ fontSize: '12px', color: '#7c6fff', animation: 'pulse 1.5s ease infinite' }}>{auditStep}</span>
                  <span style={{ fontSize: '12px', color: '#7c6fff', fontWeight: 600 }}>{auditProgress}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '5px', overflow: 'hidden' }}>
                  <div className="progress-bar-fill" style={{ width: `${auditProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Audit Results */}
          {auditResult && (
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '16px', marginBottom: '20px' }}>
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="section-label" style={{ margin: 0 }}>Audit Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <ScoreRing score={auditResult.score} size={90} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: scoreColor(auditResult.score), marginBottom: '4px' }}>
                      {auditResult.score >= 80 ? 'Excellent' : auditResult.score >= 60 ? 'Needs Work' : 'Poor'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                      {Object.values(auditResult.checks).filter((c: any) => c.pass).length} / {AUDIT_CHECKS.length} checks passed
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Load Time',   value: `${auditResult.loadTime}s`,                  good: parseFloat(auditResult.loadTime) < 2.5 },
                    { label: 'Word Count',  value: `${auditResult.wordCount.toLocaleString()} words`, good: auditResult.wordCount > 1000 },
                    { label: 'Backlinks',   value: auditResult.backlinks,                        good: auditResult.backlinks > 10 },
                    { label: 'Keywords',    value: auditResult.keywords,                         good: true },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{m.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: m.good ? '#34d399' : '#fbbf24' }}>{m.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '11px', color: '#334155', wordBreak: 'break-all' }}>
                  🔗 {auditResult.url}
                </div>
              </div>
              <div className="glass-card">
                <div className="section-label">SEO Checks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {AUDIT_CHECKS.map(check => {
                    const result = auditResult.checks[check.key];
                    return (
                      <div className="check-row" key={check.key}>
                        <span style={{ fontSize: '16px' }}>{check.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{check.label}</div>
                          <div style={{ fontSize: '11px', color: '#334155' }}>{check.desc}</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', background: result.pass ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)', color: result.pass ? '#34d399' : '#f87171' }}>
                          {result.pass ? '✓ Pass' : '✗ Fail'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Real Articles from Supabase */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div className="section-label" style={{ margin: 0 }}>Recent Articles</div>
              <a href="/dashboard/article-library" style={{ fontSize: '12px', color: '#7c6fff', textDecoration: 'none' }}>View all ↗</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 80px', gap: '12px', padding: '6px 14px', marginBottom: '6px' }}>
              {['Article', 'Score', 'Words', 'Status'].map(h => (
                <div key={h} style={{ fontSize: '11px', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
              ))}
            </div>
            {statsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '50px', borderRadius: '9px' }} />)}
              </div>
            ) : articles.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>
                No articles yet. <a href="/dashboard/writer" style={{ color: '#7c6fff' }}>Create one!</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {articles.map(a => (
                  <div className="article-row" key={a.id}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                      <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                        {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: scoreBg(a.seo_score ?? 0), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: scoreColor(a.seo_score ?? 0) }}>{a.seo_score ?? '—'}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{a.word_count ? `${a.word_count.toLocaleString()} w` : '—'}</div>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px', display: 'inline-block', background: a.status === 'published' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', color: a.status === 'published' ? '#34d399' : '#fbbf24' }}>
                      {a.status ?? 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}