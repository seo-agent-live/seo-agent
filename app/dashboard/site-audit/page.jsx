'use client';
import { useState, useEffect } from 'react';

const MOCK_ARTICLES = [
  { id: 1, title: 'Best SEO Tools 2025', url: 'https://yoursite.com/blog/best-seo-tools-2025', score: 91, words: 2340, status: 'Published', date: '2025-05-10' },
  { id: 2, title: 'How to Rank on Google', url: 'https://yoursite.com/blog/how-to-rank-on-google', score: 78, words: 1890, status: 'Published', date: '2025-05-08' },
  { id: 3, title: 'Keyword Research Guide', url: 'https://yoursite.com/blog/keyword-research-guide', score: 85, words: 3100, status: 'Published', date: '2025-05-05' },
  { id: 4, title: 'On-Page SEO Checklist', url: 'https://yoursite.com/blog/on-page-seo-checklist', score: 62, words: 1450, status: 'Draft', date: '2025-05-01' },
  { id: 5, title: 'Link Building Strategies', url: 'https://yoursite.com/blog/link-building-strategies', score: 73, words: 2780, status: 'Published', date: '2025-04-28' },
];

const AUDIT_CHECKS = [
  { key: 'title', label: 'Title Tag', desc: 'Optimal length (50–60 chars)', icon: '🏷️' },
  { key: 'meta', label: 'Meta Description', desc: 'Present and within 160 chars', icon: '📝' },
  { key: 'h1', label: 'H1 Tag', desc: 'Single H1 with target keyword', icon: '📌' },
  { key: 'speed', label: 'Page Speed', desc: 'Load time under 3s', icon: '⚡' },
  { key: 'mobile', label: 'Mobile Friendly', desc: 'Responsive viewport detected', icon: '📱' },
  { key: 'https', label: 'HTTPS Secure', desc: 'SSL certificate valid', icon: '🔒' },
  { key: 'canonical', label: 'Canonical Tag', desc: 'Canonical URL is set', icon: '🔗' },
  { key: 'images', label: 'Image Alt Text', desc: 'All images have alt attributes', icon: '🖼️' },
  { key: 'schema', label: 'Schema Markup', desc: 'Structured data detected', icon: '🧩' },
  { key: 'internal', label: 'Internal Links', desc: 'At least 3 internal links', icon: '🕸️' },
];

function randomScore() { return Math.floor(Math.random() * 41) + 55; }
function randomBool(weight = 0.7) { return Math.random() < weight; }

function generateAuditResults(url) {
  const score = randomScore();
  return {
    url,
    score,
    checks: AUDIT_CHECKS.reduce((acc, c) => {
      acc[c.key] = {
        pass: randomBool(score > 75 ? 0.8 : 0.5),
        detail: '',
      };
      return acc;
    }, {}),
    loadTime: (Math.random() * 3 + 0.8).toFixed(2),
    wordCount: Math.floor(Math.random() * 2000 + 800),
    backlinks: Math.floor(Math.random() * 200),
    keywords: Math.floor(Math.random() * 20 + 3),
  };
}

function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="7"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="50%" y="50%" fill={color} fontSize={size * 0.22} fontWeight="700"
        textAnchor="middle" dominantBaseline="central"
        style={{ transform: `rotate(90deg) translate(0, 0)`, transformOrigin: 'center', transformBox: 'fill-box' }}>
        {score}
      </text>
    </svg>
  );
}

export default function SiteAuditPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStep, setAuditStep] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalArticles: 24,
        avgSeoScore: 81,
        keywordsTracked: 138,
        organicTraffic: '4.2K',
      });
    }, 800);
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

  const scoreColor = (s) => s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : '#f87171';
  const scoreBg = (s) => s >= 80 ? 'rgba(52,211,153,0.12)' : s >= 60 ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .audit-page {
          background: #0d0f14;
          min-height: 100vh;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          padding: 32px 32px 60px;
        }

        /* Subtle grid background */
        .audit-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .audit-content { position: relative; z-index: 1; max-width: 1000px; }

        .stat-card {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px 22px;
          transition: border-color 0.2s, background 0.2s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.042);
          border-color: rgba(124,111,255,0.2);
        }

        .url-input {
          flex: 1;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 13px 16px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .url-input:focus {
          border-color: rgba(124,111,255,0.5);
          box-shadow: 0 0 0 3px rgba(124,111,255,0.08);
        }
        .url-input::placeholder { color: #334155; }

        .analyze-btn {
          padding: 13px 26px;
          background: #7c6fff;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .analyze-btn:hover:not(:disabled) { background: #6d5ff0; }
        .analyze-btn:active:not(:disabled) { transform: scale(0.98); }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .glass-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px;
        }

        .check-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 9px;
          background: rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .check-row:hover { background: rgba(0,0,0,0.25); }

        .article-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 9px;
          background: rgba(0,0,0,0.12);
          border: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          cursor: pointer;
        }
        .article-row:hover { background: rgba(124,111,255,0.06); border-color: rgba(124,111,255,0.15); }

        .skeleton {
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease; }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c6fff, #a78bfa);
          border-radius: 6px;
          transition: width 0.4s ease;
        }

        .section-label {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 14px;
        }

        .view-all-btn {
          font-size: 12px;
          color: #7c6fff;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s;
        }
        .view-all-btn:hover { color: #a78bfa; }
      `}</style>

      <div className="audit-page">
        <div className="audit-content">

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '12px', color: '#334155', marginBottom: '8px', letterSpacing: '0.3px' }}>
              SEOAgent / <span style={{ color: '#475569' }}>SEO Analytics</span>
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', margin: 0, marginBottom: '5px' }}>
              SEO Analytics
            </h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
              Analyze any URL and track your content performance.
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Total Articles', value: stats?.totalArticles, suffix: '', icon: '📄', color: '#7c6fff' },
              { label: 'Avg SEO Score', value: stats?.avgSeoScore, suffix: '%', icon: '📊', color: '#34d399' },
              { label: 'Keywords Tracked', value: stats?.keywordsTracked, suffix: '', icon: '🔍', color: '#fbbf24' },
              { label: 'Organic Traffic', value: stats?.organicTraffic, suffix: '/mo', icon: '📈', color: '#60a5fa' },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '10px', fontWeight: 500 }}>{s.label}</div>
                {stats ? (
                  <div className="fade-up">
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1 }}>
                      {s.value}<span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>{s.suffix}</span>
                    </div>
                    <div style={{ marginTop: '10px', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${i === 0 ? 60 : i === 1 ? 81 : i === 2 ? 70 : 45}%`, height: '100%', background: s.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="skeleton" style={{ width: '70px', height: '28px', marginBottom: '10px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '3px' }} />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Analyze URL Panel */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,111,255,0.12) 0%, rgba(124,111,255,0.05) 100%)',
            border: '1px solid rgba(124,111,255,0.2)',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '20px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px', letterSpacing: '-0.3px' }}>
              Analyze a URL
            </h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: loading ? '16px' : 0 }}>
              <input
                className="url-input"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder="https://yoursite.com/blog/your-article"
              />
              <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !url.trim()}>
                {loading ? 'Analysing…' : <>Analyze <span>→</span></>}
              </button>
            </div>

            {loading && (
              <div className="fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ fontSize: '12px', color: '#7c6fff', animation: 'pulse 1.5s ease infinite' }}>
                    {auditStep}
                  </span>
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

              {/* Score Summary */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="section-label" style={{ margin: 0 }}>Audit Score</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ position: 'relative' }}>
                    <ScoreRing score={auditResult.score} size={90} />
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: scoreColor(auditResult.score), marginBottom: '4px' }}>
                      {auditResult.score >= 80 ? 'Excellent' : auditResult.score >= 60 ? 'Needs Work' : 'Poor'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                      {auditResult.checks && Object.values(auditResult.checks).filter(c => c.pass).length} / {AUDIT_CHECKS.length} checks passed
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Load Time', value: `${auditResult.loadTime}s`, good: parseFloat(auditResult.loadTime) < 2.5 },
                    { label: 'Word Count', value: `${auditResult.wordCount.toLocaleString()} words`, good: auditResult.wordCount > 1000 },
                    { label: 'Backlinks', value: auditResult.backlinks, good: auditResult.backlinks > 10 },
                    { label: 'Keywords', value: auditResult.keywords, good: true },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{m.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: m.good ? '#34d399' : '#fbbf24' }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#334155',
                  wordBreak: 'break-all',
                }}>
                  🔗 {auditResult.url}
                </div>
              </div>

              {/* Checks */}
              <div className="glass-card">
                <div className="section-label">SEO Checks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {AUDIT_CHECKS.map((check) => {
                    const result = auditResult.checks[check.key];
                    return (
                      <div className="check-row" key={check.key}>
                        <span style={{ fontSize: '16px' }}>{check.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{check.label}</div>
                          <div style={{ fontSize: '11px', color: '#334155' }}>{check.desc}</div>
                        </div>
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 9px', borderRadius: '5px',
                          background: result.pass ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                          color: result.pass ? '#34d399' : '#f87171',
                        }}>
                          {result.pass ? '✓ Pass' : '✗ Fail'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Articles */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div className="section-label" style={{ margin: 0 }}>Recent Articles</div>
              <button className="view-all-btn">View all ↗</button>
            </div>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 90px 80px',
              gap: '12px',
              padding: '6px 14px',
              marginBottom: '6px',
            }}>
              {['Article', 'Score', 'Words', 'Status'].map(h => (
                <div key={h} style={{ fontSize: '11px', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {MOCK_ARTICLES.map((a) => (
                <div
                  className="article-row"
                  key={a.id}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 80px', gap: '12px', alignItems: 'center' }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.url}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: scoreBg(a.score), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: scoreColor(a.score) }}>{a.score}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569' }}>{a.words.toLocaleString()} w</div>

                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    padding: '3px 9px', borderRadius: '5px', display: 'inline-block',
                    background: a.status === 'Published' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                    color: a.status === 'Published' ? '#34d399' : '#fbbf24',
                  }}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}