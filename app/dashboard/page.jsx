'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Plus, ArrowUpRight } from 'lucide-react';

const statusStyles = {
  Published: { background: 'rgba(29,184,160,0.15)', color: '#1DB8A0', dot: '#1DB8A0' },
  Draft:     { background: 'rgba(79,124,255,0.15)',  color: '#4F7CFF',  dot: '#4F7CFF'  },
  Review:    { background: 'rgba(245,158,11,0.15)',  color: '#f59e0b',  dot: '#f59e0b'  },
};

const quickActions = [
  { label: 'New Article',         icon: '✍️', href: '/dashboard/writer',      accent: 'rgba(79,124,255,0.15)',   iconColor: '#4F7CFF' },
  { label: 'Research Keywords',   icon: '🔍', href: '/dashboard/keywords',    accent: 'rgba(29,184,160,0.15)',   iconColor: '#1DB8A0' },
  { label: 'Analyze Competitors', icon: '📊', href: '/dashboard/competitors', accent: 'rgba(245,158,11,0.15)',   iconColor: '#f59e0b' },
  { label: 'Site Audit',          icon: '🌐', href: '/dashboard/audit',       accent: 'rgba(239,68,68,0.12)',    iconColor: '#ef4444' },
];

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName = user?.firstName
    || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]
    || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const emoji = hour < 12 ? '🌤️' : hour < 18 ? '☀️' : '👋';

  useEffect(() => {
    async function load() {
      try {
        const [articlesRes, keywordsRes, competitorsRes] = await Promise.all([
          fetch('/api/analytics/articles'),
          fetch('/api/analytics/keywords'),
          fetch('/api/competitive'),
        ]);
        const articles    = articlesRes.ok    ? await articlesRes.json()    : {};
        const keywords    = keywordsRes.ok    ? await keywordsRes.json()    : {};
        const competitors = competitorsRes.ok ? await competitorsRes.json() : {};

        const analyses = competitors.analyses ?? [];
        const competitorGaps = analyses.length * 5;
        const avgScore = articles.avgSeoScore ?? 0;

        setData({
          totalArticles:        articles.total         ?? 0,
          articlesThisWeek:     articles.thisWeek       ?? 0,
          avgSeoScore:          avgScore,
          seoScoreChange:       articles.seoScoreChange ?? 0,
          keywordsTracked:      keywords.total          ?? 0,
          newKeywordsThisWeek:  keywords.thisWeek       ?? 0,
          competitorGaps,
          recentArticles:       articles.recent         ?? [],
          healthLabel:          avgScore >= 80 ? 'Good standing' : avgScore >= 50 ? 'Needs work' : 'Poor health',
          healthIssues:         avgScore >= 80 ? 1 : avgScore >= 50 ? 3 : 6,
        });
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    { label: 'Articles Generated', value: data?.totalArticles ?? 0,    sub: `+${data?.articlesThisWeek ?? 0} this week`,         color: '#4F7CFF',  subColor: '#1DB8A0' },
    { label: 'Avg SEO Score',      value: data?.avgSeoScore ?? 0,       sub: `+${data?.seoScoreChange ?? 0}pts from last week`,   color: '#1DB8A0',  subColor: '#1DB8A0' },
    { label: 'Keywords Tracked',   value: data?.keywordsTracked ?? 0,   sub: `+${data?.newKeywordsThisWeek ?? 0} new this week`,  color: '#E8EDF8',  subColor: '#1DB8A0' },
    { label: 'Competitor Gaps',    value: data?.competitorGaps ?? 0,    sub: `${data?.competitorGaps ?? 0} new opportunities`,    color: '#f59e0b',  subColor: '#f59e0b' },
  ];

  // Health ring calc
  const score = data?.avgSeoScore ?? 0;
  const r = 27, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#1C2B4A', color: '#E8EDF8' }}>

      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 24px', borderBottom: '1px solid #2A3F6A',
        background: '#1C2B4A', flexShrink: 0,
      }}>
        <p style={{ fontSize: '12px', color: '#7B8DB0', margin: 0 }}>
          <span style={{ color: '#E8EDF8' }}>RankFlow</span>
          <span style={{ margin: '0 6px', color: '#2A3F6A' }}>/</span>
          Dashboard
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => router.push('/dashboard/library')}
            style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
              background: 'transparent', border: '1px solid #2A3F6A', color: '#7B8DB0', cursor: 'pointer',
            }}>
            Import
          </button>
          <button
            onClick={() => router.push('/dashboard/writer')}
            style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
              background: '#4F7CFF', border: 'none', color: '#fff', cursor: 'pointer',
            }}>
            + New Article
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#E8EDF8', marginBottom: '4px' }}>
            {greeting}, {firstName} {emoji}
          </h1>
          <p style={{ fontSize: '13px', color: '#7B8DB0', margin: 0 }}>
            Here's your SEO performance overview for the past 7 days.
          </p>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '18px' }}>
          {quickActions.map(a => (
            <div key={a.label} onClick={() => router.push(a.href)} style={{
              background: '#213354', border: '1px solid #2A3F6A', borderRadius: '10px',
              padding: '13px 12px', display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4F7CFF'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2A3F6A'}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                background: a.accent, flexShrink: 0,
              }}>
                {a.icon}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#E8EDF8', lineHeight: '1.3' }}>
                {a.label}
              </span>
            </div>
          ))}
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '18px' }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#213354', border: '1px solid #2A3F6A',
              borderRadius: '10px', padding: '16px',
            }}>
              <p style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7B8DB0', marginBottom: '10px' }}>
                {s.label}
              </p>
              {loading
                ? <div style={{ height: '36px', width: '60px', borderRadius: '6px', background: '#2A3F6A', marginBottom: '8px' }} />
                : <p style={{ fontSize: '28px', fontWeight: '500', color: s.color, marginBottom: '4px' }}>{s.value}</p>
              }
              {loading
                ? <div style={{ height: '12px', width: '100px', borderRadius: '4px', background: '#2A3F6A' }} />
                : <p style={{ fontSize: '12px', color: s.subColor, margin: 0 }}>{s.sub}</p>
              }
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: '14px' }}>

          {/* Recent articles */}
          <div style={{ background: '#213354', border: '1px solid #2A3F6A', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #2A3F6A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#E8EDF8' }}>Recent Articles</span>
              <Link href="/dashboard/library" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ height: '16px', borderRadius: '4px', background: '#2A3F6A', width: `${70 + i * 5}%` }} />
                ))}
              </div>
            ) : data?.recentArticles?.length > 0 ? (
              data.recentArticles.map(article => {
                const st = statusStyles[article.status] ?? statusStyles.Draft;
                return (
                  <div key={article.id}
                    onClick={() => router.push(`/dashboard/writer?id=${article.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '11px',
                      padding: '11px 18px', borderBottom: '1px solid #2A3F6A',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,124,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '12.5px', color: '#E8EDF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.title}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#7B8DB0', width: '26px', textAlign: 'right', flexShrink: 0 }}>
                      {article.seoScore}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '20px',
                      background: st.background, color: st.color, flexShrink: 0,
                    }}>
                      {article.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                <FileText size={20} color="#2A3F6A" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '13px', color: '#7B8DB0', marginBottom: '12px' }}>No articles yet</p>
                <button onClick={() => router.push('/dashboard/writer')} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                  borderRadius: '8px', background: 'rgba(79,124,255,0.15)', border: '1px solid rgba(79,124,255,0.3)',
                  color: '#4F7CFF', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                }}>
                  <Plus size={13} /> New Article
                </button>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* SEO Health */}
            <div style={{ background: '#213354', border: '1px solid #2A3F6A', borderRadius: '10px', padding: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#E8EDF8', marginBottom: 0 }}>Overall SEO Health</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '12px 0 14px' }}>
                {/* Ring */}
                <div style={{ position: 'relative', width: '66px', height: '66px', flexShrink: 0 }}>
                  <svg width="66" height="66" viewBox="0 0 66 66" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="33" cy="33" r={r} fill="none" stroke="#2A3F6A" strokeWidth="6" />
                    <circle cx="33" cy="33" r={r} fill="none" stroke="#4F7CFF" strokeWidth="6"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '500', color: '#4F7CFF' }}>
                    {loading ? '—' : score}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#E8EDF8', margin: '0 0 3px' }}>
                    {loading ? '...' : data?.healthLabel}
                  </p>
                  <p style={{ fontSize: '12px', color: '#7B8DB0', margin: 0 }}>
                    {loading ? '' : `${data?.healthIssues} items need attention`}
                  </p>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/audit')} style={{
                width: '100%', padding: '9px', background: 'rgba(79,124,255,0.12)',
                border: '1px solid rgba(79,124,255,0.3)', borderRadius: '8px',
                color: '#4F7CFF', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
              }}>
                View Full Report →
              </button>
            </div>

            {/* Top Keywords */}
            <div style={{ background: '#213354', border: '1px solid #2A3F6A', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '13px 16px', borderBottom: '1px solid #2A3F6A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#E8EDF8' }}>Top Keywords</span>
                <Link href="/dashboard/keywords" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none' }}>See all</Link>
              </div>
              {loading ? (
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ height: '14px', borderRadius: '4px', background: '#2A3F6A' }} />
                  ))}
                </div>
              ) : (data?.keywordsTracked ?? 0) === 0 ? (
                <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#7B8DB0', margin: '0 0 8px' }}>No keywords yet</p>
                  <Link href="/dashboard/keywords" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none' }}>
                    + Track keywords
                  </Link>
                </div>
              ) : (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ padding: '8px 16px', fontSize: '12px', color: '#7B8DB0', textAlign: 'center' }}>
                    {data?.keywordsTracked} keywords tracked
                  </div>
                  <div style={{ padding: '0 16px 8px', textAlign: 'center' }}>
                    <Link href="/dashboard/keywords" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none' }}>
                      View all keywords →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}