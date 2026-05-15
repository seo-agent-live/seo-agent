'use client';
import { useUser } from '@clerk/nextjs';

const stats = [
  { label: 'Articles Generated', value: '47', delta: '+12 this week', deltaColor: '#1DB8A0' },
  { label: 'Avg SEO Score', value: '84', delta: '+3pts from last week', deltaColor: '#1DB8A0' },
  { label: 'Keywords Tracked', value: '212', delta: '+18 new this week', deltaColor: '#1DB8A0' },
  { label: 'Competitor Gaps', value: '31', delta: '5 new opportunities', deltaColor: '#4F7CFF' },
];

const articles = [
  { title: '10 Best SEO Strategies for SaaS in 2025', score: 92, status: 'Published', dot: '#1DB8A0', bg: 'rgba(29,184,160,0.12)', color: '#1DB8A0' },
  { title: 'How to Build Topical Authority', score: 88, status: 'Draft', dot: '#4F7CFF', bg: 'rgba(79,124,255,0.12)', color: '#4F7CFF' },
  { title: 'Competitor Gap Analysis Playbook', score: 76, status: 'Review', dot: '#F59E0B', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  { title: 'Long-Tail Keywords Ultimate Guide', score: 95, status: 'Published', dot: '#1DB8A0', bg: 'rgba(29,184,160,0.12)', color: '#1DB8A0' },
  { title: 'Internal Linking Strategy 2025', score: 81, status: 'Draft', dot: '#4F7CFF', bg: 'rgba(79,124,255,0.12)', color: '#4F7CFF' },
];

const keywords = [
  { kw: 'ai seo tools', pos: 3, delta: '+2', up: true },
  { kw: 'seo content generator', pos: 7, delta: '+5', up: true },
  { kw: 'keyword research ai', pos: 12, delta: '-1', up: false },
  { kw: 'competitor analysis tool', pos: 5, delta: '+3', up: true },
];

const quickActions = [
  { label: 'New Article', icon: '✍️', color: 'rgba(79,124,255,0.15)', href: '/dashboard/writer' },
  { label: 'Research Keywords', icon: '🔍', color: 'rgba(29,184,160,0.15)', href: '/dashboard/research' },
  { label: 'Analyze Competitors', icon: '📊', color: 'rgba(211,84,134,0.15)', href: '/dashboard/competitors' },
  { label: 'Site Audit', icon: '🌐', color: 'rgba(245,158,11,0.15)', href: '/dashboard/site-audit' },
];

const s = {
  page: {
    padding: '28px',
    background: '#0D1117',
    minHeight: '100vh',
    fontFamily: 'Inter,-apple-system,sans-serif',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  greeting: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#E8EDF8',
    letterSpacing: '-0.3px',
  },
  sub: {
    fontSize: '13px',
    color: '#4A5568',
    marginTop: '4px',
  },
  btnGhost: {
    fontSize: '12px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #21262D',
    background: 'transparent',
    color: '#8B949E',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginRight: '8px',
  },
  btnPrimary: {
    fontSize: '12px',
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    background: '#4F7CFF',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
  },
  qaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  qaCard: {
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'border-color 0.2s',
  },
  qaIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  qaLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#E8EDF8',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: '12px',
    padding: '20px',
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    color: '#8B949E',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#E8EDF8',
    letterSpacing: '-1px',
    marginBottom: '4px',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '16px',
  },
  card: {
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: '12px',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#E8EDF8',
  },
  cardLink: {
    fontSize: '12px',
    color: '#4F7CFF',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  artRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 0',
  },
  artTitle: {
    fontSize: '13px',
    color: '#C9D1D9',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  artScore: {
    fontSize: '12px',
    color: '#8B949E',
    flexShrink: 0,
    marginRight: '6px',
  },
  healthBtn: {
    display: 'block',
    width: '100%',
    padding: '10px',
    background: 'rgba(79,124,255,0.1)',
    border: '1px solid rgba(79,124,255,0.3)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4F7CFF',
    cursor: 'pointer',
    textAlign: 'center' as const,
    fontFamily: 'inherit',
    marginBottom: '14px',
    textDecoration: 'none',
  },
  kwRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '9px 0',
  },
};

export default function DashboardPage() {
  const { user } = useUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = user?.firstName ?? 'there';

  return (
    <div style={s.page}>
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
        {stats.map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statLabel}>{stat.label}</div>
            <div style={s.statValue}>{stat.value}</div>
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
          {articles.map((a, i) => (
            <div key={i} style={{
              ...s.artRow,
              borderBottom: i < articles.length - 1 ? '1px solid #21262D' : 'none',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
              <span style={s.artTitle}>{a.title}</span>
              <span style={s.artScore}>{a.score}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '10px',
                background: a.bg,
                color: a.color,
                flexShrink: 0,
              }}>{a.status}</span>
            </div>
          ))}
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
                    strokeDasharray="163" strokeDashoffset="26" strokeLinecap="round"/>
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#E8EDF8',
                }}>84</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#E8EDF8', marginBottom: '4px' }}>Good standing</div>
                <div style={{ fontSize: '11px', color: '#8B949E' }}>3 items need attention</div>
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
            {keywords.map((k, i) => (
              <div key={i} style={{
                ...s.kwRow,
                borderBottom: i < keywords.length - 1 ? '1px solid #21262D' : 'none',
              }}>
                <span style={{ fontSize: '12px', color: '#C9D1D9', flex: 1 }}>{k.kw}</span>
                <span style={{ fontSize: '12px', color: '#8B949E', marginRight: '10px' }}>#{k.pos}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: k.up ? '#1DB8A0' : '#E24B4A' }}>{k.delta}</span>
              </div>
            ))}
          </div>

          {/* Upgrade */}
          <div style={{
            background: 'linear-gradient(135deg,#4F7CFF,#1DB8A0)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>⚡ Unlock Pro Features</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '14px' }}>
              Bulk generate, competitor snapshots & more
            </div>
            <a href="/pricing" style={{
              display: 'block', padding: '9px', background: 'white', borderRadius: '8px',
              fontSize: '12px', fontWeight: '700', color: '#4F7CFF', textDecoration: 'none',
            }}>Upgrade to Pro →</a>
          </div>

        </div>
      </div>
    </div>
  );
}