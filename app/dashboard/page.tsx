'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const quickActions = [
  { label: 'New Article',        icon: '✍️', color: 'rgba(79,124,255,0.15)',  href: '/dashboard/writer' },
  { label: 'Research Keywords',  icon: '🔍', color: 'rgba(29,184,160,0.15)',  href: '/dashboard/research' },
  { label: 'Analyze Competitors',icon: '📊', color: 'rgba(211,84,134,0.15)', href: '/dashboard/competitors' },
  { label: 'Site Audit',         icon: '🌐', color: 'rgba(245,158,11,0.15)', href: '/dashboard/site-audit' },
];

const statusStyle: Record<string, { dot: string; bg: string; color: string }> = {
  published: { dot: '#1DB8A0', bg: 'rgba(29,184,160,0.12)',  color: '#1DB8A0' },
  draft:     { dot: '#4F7CFF', bg: 'rgba(79,124,255,0.12)',  color: '#4F7CFF' },
  review:    { dot: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B' },
  failed:    { dot: '#E24B4A', bg: 'rgba(226,75,74,0.12)',   color: '#E24B4A' },
};

const s = {
  page:      { padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' },
  topbar:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' },
  greeting:  { fontSize: '22px', fontWeight: '700', color: '#E8EDF8', letterSpacing: '-0.3px' },
  sub:       { fontSize: '13px', color: '#4A5568', marginTop: '4px' },
  btnGhost:  { fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #21262D', background: 'transparent', color: '#8B949E', cursor: 'pointer', fontFamily: 'inherit', marginRight: '8px' },
  btnPrimary:{ fontSize: '12px', padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#4F7CFF', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', textDecoration: 'none', display: 'inline-block' },
  qaGrid:    { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' },
  qaCard:    { background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none', transition: 'border-color 0.2s' },
  qaIcon:    { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
  qaLabel:   { fontSize: '13px', fontWeight: '500', color: '#E8EDF8' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' },
  statCard:  { background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' },
  statLabel: { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: '#8B949E', marginBottom: '10px' },
  statValue: { fontSize: '32px', fontWeight: '700', color: '#E8EDF8', letterSpacing: '-1px', marginBottom: '4px' },
  bottomGrid:{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' },
  card:      { background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' },
  cardHeader:{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  cardTitle: { fontSize: '14px', fontWeight: '600', color: '#E8EDF8' },
  cardLink:  { fontSize: '12px', color: '#4F7CFF', textDecoration: 'none', cursor: 'pointer' },
  artRow:    { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0' },
  artTitle:  { fontSize: '13px', color: '#C9D1D9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  artScore:  { fontSize: '12px', color: '#8B949E', flexShrink: 0, marginRight: '6px' },
  healthBtn: { display: 'block', width: '100%', padding: '10px', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#4F7CFF', cursor: 'pointer', textAlign: 'center' as const, fontFamily: 'inherit', marginBottom: '14px', textDecoration: 'none' },
  kwRow:     { display: 'flex', alignItems: 'center', padding: '9px 0' },
  skeleton:  { background: '#21262D', borderRadius: '6px', animation: 'pulse 1.5s ease infinite' },
};

export default function DashboardPage() {
  const { user } = useUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = user?.firstName ?? 'there';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ articles: 0, avgScore: 0, keywords: 0, gaps: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [topKeywords, setTopKeywords] = useState<any[]>([]);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    async function load() {
      // Articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, seo_score, status, created_at')
        .order('created_at', { ascending: false });

      const total = articles?.length ?? 0;
      const scores = articles?.map(a => a.seo_score ?? 0).filter(s => s > 0) ?? [];
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const recent = (articles ?? []).slice(0, 5);

      // Keywords
      const { data: keywords } = await supabase
        .from('keywords')
        .select('id, keyword, position, change')
        .order('created_at', { ascending: false })
        .limit(4);

      // Competitors
      const { data: competitors } = await supabase
        .from('competitors')
        .select('id');

      setStats({
        articles: total,
        avgScore: avg,
        keywords: keywords?.length ?? 0,
        gaps: competitors?.length ?? 0,
      });
      setRecentArticles(recent);
      setTopKeywords(keywords ?? []);
      setAvgScore(avg);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Articles Generated', value: stats.articles, delta: 'Total articles', deltaColor: '#1DB8A0' },
    { label: 'Avg SEO Score',      value: stats.avgScore,  delta: 'Across all articles', deltaColor: '#1DB8A0' },
    { label: 'Keywords Tracked',   value: stats.keywords,  delta: 'Being monitored', deltaColor: '#1DB8A0' },
    { label: 'Competitor Gaps',    value: stats.gaps,      delta: 'Competitors tracked', deltaColor: '#4F7CFF' },
  ];

  // Score circle offset (circumference = 163)
  const offset = Math.round(163 - (163 * avgScore) / 100);

  return (
    <div style={s.page}>
      <style>{`@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>

      {/* Topbar */}
      <div style={s.topbar}>
        <div>
          <div style={s.greeting}>{greeting}, {name} 👋</div>
          <div style={s.sub}>Here's your SEO performance for the past 7 days.</div>
        </div>
        <div>
          <button style={s.btnGhost}>Import</button>
          <a href="/dashboard/writer" style={s.btnPrimary}>+ New Article</a>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={s.qaGrid}>
        {quickActions.map(a => (
          <a key={a.label} href={a.href} style={s.qaCard}>
            <div style={{ ...s.qaIcon, background: a.color }}>{a.icon}</div>
            <span style={s.qaLabel}>{a.label}</span>
          </a>
        ))}
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {statCards.map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statLabel}>{stat.label}</div>
            {loading
              ? <div style={{ ...s.skeleton, height: '40px', width: '80px', marginBottom: '8px' }} />
              : <div style={s.statValue}>{stat.value}</div>
            }
            <div style={{ fontSize: '12px', color: stat.deltaColor }}>{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={s.bottomGrid}>

        {/* Recent Articles */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Recent Articles</span>
            <a href="/dashboard/article-library" style={s.cardLink}>View all →</a>
          </div>
          {loading ? (
            [1,2,3,4,5].map(i => (
              <div key={i} style={{ ...s.artRow, borderBottom: '1px solid #21262D' }}>
                <div style={{ ...s.skeleton, height: '12px', flex: 1 }} />
              </div>
            ))
          ) : recentArticles.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#4A5568', textAlign: 'center', padding: '24px 0' }}>
              No articles yet. <a href="/dashboard/writer" style={{ color: '#4F7CFF' }}>Create one!</a>
            </div>
          ) : recentArticles.map((a, i) => {
            const st = (a.status ?? 'draft').toLowerCase();
            const style = statusStyle[st] ?? statusStyle.draft;
            return (
              <div key={a.id} style={{
                ...s.artRow,
                borderBottom: i < recentArticles.length - 1 ? '1px solid #21262D' : 'none',
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
                <span style={s.artTitle}>{a.title}</span>
                <span style={s.artScore}>{a.seo_score ?? '—'}</span>
                <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', background: style.bg, color: style.color, flexShrink: 0 }}>
                  {a.status ?? 'Draft'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* SEO Health */}
          <div style={s.card}>
            <div style={s.cardHeader}><span style={s.cardTitle}>Overall SEO Health</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#21262D" strokeWidth="6"/>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#4F7CFF" strokeWidth="6"
                    strokeDasharray="163" strokeDashoffset={offset} strokeLinecap="round"/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#E8EDF8' }}>
                  {loading ? '—' : avgScore}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#E8EDF8', marginBottom: '4px' }}>
                  {avgScore >= 80 ? 'Good standing' : avgScore >= 60 ? 'Needs work' : 'Needs attention'}
                </div>
                <div style={{ fontSize: '11px', color: '#8B949E' }}>Based on your articles</div>
              </div>
            </div>
            <a href="/dashboard/analytics" style={s.healthBtn}>View Full Report →</a>
          </div>

          {/* Top Keywords */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Top Keywords</span>
              <a href="/dashboard/keywords" style={s.cardLink}>See all</a>
            </div>
            {loading ? (
              [1,2,3].map(i => <div key={i} style={{ ...s.skeleton, height: '12px', marginBottom: '12px' }} />)
            ) : topKeywords.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#4A5568', textAlign: 'center', padding: '12px 0' }}>
                No keywords tracked yet.
              </div>
            ) : topKeywords.map((k, i) => (
              <div key={k.id} style={{ ...s.kwRow, borderBottom: i < topKeywords.length - 1 ? '1px solid #21262D' : 'none' }}>
                <span style={{ fontSize: '12px', color: '#C9D1D9', flex: 1 }}>{k.keyword}</span>
                <span style={{ fontSize: '12px', color: '#8B949E', marginRight: '10px' }}>#{k.position ?? '—'}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: (k.change ?? 0) >= 0 ? '#1DB8A0' : '#E24B4A' }}>
                  {(k.change ?? 0) >= 0 ? '+' : ''}{k.change ?? 0}
                </span>
              </div>
            ))}
          </div>

          {/* Upgrade */}
          <div style={{ background: 'linear-gradient(135deg,#4F7CFF,#1DB8A0)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>⚡ Unlock Pro Features</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '14px' }}>
              Bulk generate, competitor snapshots & more
            </div>
            <a href="/pricing" style={{ display: 'block', padding: '9px', background: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#4F7CFF', textDecoration: 'none' }}>
              Upgrade to Pro →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}