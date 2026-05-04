'use client';

import { useEffect, useState } from 'react';

interface StripeData {
  mrr: number;
  totalRevenue: number;
  activeSubscriptions: number;
  recentPayments: { date: string; amount: number; customer: string }[];
}

interface GscData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  connected: boolean;
}

interface ArticleData {
  total: number;
  thisMonth: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);

const fmtNum = (n: number) =>
  new Intl.NumberFormat('en-GB').format(n);

function StatCard({
  label,
  value,
  sub,
  accent,
  loading,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  loading?: boolean;
}) {
  return (
    <div style={{
      background: '#0f0f0f',
      border: `1px solid ${accent ? '#1a3a28' : '#1a1a1a'}`,
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{ color: '#444', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
        {label}
      </div>
      {loading ? (
        <div style={{ height: '36px', background: '#1a1a1a', borderRadius: '6px', animation: 'pulse 1.5s ease infinite' }} />
      ) : (
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '32px',
          fontWeight: 800,
          color: accent ? '#00e5a0' : '#f0f0f0',
          letterSpacing: '-1px',
          lineHeight: 1,
          marginBottom: sub ? '6px' : 0,
        }}>
          {value}
        </div>
      )}
      {sub && !loading && (
        <div style={{ color: '#333', fontSize: '12px' }}>{sub}</div>
      )}
    </div>
  );
}

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        color: '#f0f0f0',
      }}>
        {title}
      </h2>
      {badge && (
        <span style={{
          background: '#0d2419',
          color: '#00e5a0',
          fontSize: '11px',
          fontWeight: 600,
          padding: '3px 10px',
          borderRadius: '99px',
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [stripe, setStripe] = useState<StripeData | null>(null);
  const [gsc, setGsc] = useState<GscData | null>(null);
  const [articles, setArticles] = useState<ArticleData | null>(null);
  const [stripeLoading, setStripeLoading] = useState(true);
  const [gscLoading, setGscLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/stripe')
      .then((r) => r.json())
      .then((d) => { setStripe(d); setStripeLoading(false); })
      .catch(() => setStripeLoading(false));

    fetch('/api/analytics/gsc')
      .then((r) => r.json())
      .then((d) => { setGsc(d); setGscLoading(false); })
      .catch(() => { setGsc({ clicks: 0, impressions: 0, ctr: 0, position: 0, connected: false }); setGscLoading(false); });

    fetch('/api/analytics/articles')
      .then((r) => r.json())
      .then((d) => setArticles(d))
      .catch(() => setArticles({ total: 0, thisMonth: 0 }));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      fontFamily: "'DM Sans', sans-serif",
      padding: '40px 32px',
      color: '#e0e0e0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        @media (max-width: 900px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .grid-4, .grid-2 { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '28px',
          fontWeight: 800,
          color: '#f0f0f0',
          letterSpacing: '-0.5px',
          marginBottom: '6px',
        }}>
          Analytics
        </h1>
        <p style={{ color: '#444', fontSize: '14px' }}>
          Live data from Stripe and Google Search Console
        </p>
      </div>

      {/* ── STRIPE SECTION ── */}
      <div style={{ marginBottom: '40px' }}>
        <SectionHeader title="Revenue" badge="Stripe Live" />
        <div className="grid-4">
          <StatCard
            label="MRR"
            value={stripe ? fmt(stripe.mrr / 100) : '—'}
            sub="Monthly recurring revenue"
            accent
            loading={stripeLoading}
          />
          <StatCard
            label="Total Revenue"
            value={stripe ? fmt(stripe.totalRevenue / 100) : '—'}
            sub="All time"
            loading={stripeLoading}
          />
          <StatCard
            label="Active Subscriptions"
            value={stripe ? fmtNum(stripe.activeSubscriptions) : '—'}
            sub="Paying customers"
            loading={stripeLoading}
          />
          <StatCard
            label="Avg Revenue / User"
            value={stripe && stripe.activeSubscriptions > 0
              ? fmt(stripe.mrr / 100 / stripe.activeSubscriptions)
              : '—'}
            sub="ARPU"
            loading={stripeLoading}
          />
        </div>
      </div>

      {/* Recent payments */}
      {stripe?.recentPayments && stripe.recentPayments.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <SectionHeader title="Recent Payments" />
          <div style={{
            background: '#0f0f0f',
            border: '1px solid #1a1a1a',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {stripe.recentPayments.map((p, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < stripe.recentPayments.length - 1 ? '1px solid #141414' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#d0d0d0', fontWeight: 500 }}>{p.customer || 'Customer'}</div>
                  <div style={{ fontSize: '12px', color: '#444', marginTop: '2px' }}>{p.date}</div>
                </div>
                <div style={{ color: '#00e5a0', fontWeight: 600, fontSize: '14px' }}>
                  {fmt(p.amount / 100)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GSC SECTION ── */}
      <div style={{ marginBottom: '40px' }}>
        <SectionHeader
          title="Search Performance"
          badge={gsc?.connected ? 'GSC Live' : 'Not Connected'}
        />

        {!gsc?.connected && !gscLoading ? (
          <div style={{
            background: '#0f0f0f',
            border: '1px dashed #222',
            borderRadius: '14px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔗</div>
            <div style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>
              Connect Google Search Console to see clicks, impressions, and rankings.
            </div>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#00e5a0',
                color: '#080808',
                padding: '11px 24px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Connect GSC →
            </a>
            <p style={{ color: '#2a2a2a', fontSize: '12px', marginTop: '12px' }}>
              Then add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env
            </p>
          </div>
        ) : (
          <div className="grid-4">
            <StatCard label="Total Clicks" value={gsc ? fmtNum(gsc.clicks) : '—'} loading={gscLoading} />
            <StatCard label="Impressions" value={gsc ? fmtNum(gsc.impressions) : '—'} loading={gscLoading} />
            <StatCard label="Avg CTR" value={gsc ? `${(gsc.ctr * 100).toFixed(1)}%` : '—'} loading={gscLoading} />
            <StatCard label="Avg Position" value={gsc ? gsc.position.toFixed(1) : '—'} loading={gscLoading} />
          </div>
        )}
      </div>

      {/* ── ARTICLES SECTION ── */}
      <div style={{ marginBottom: '40px' }}>
        <SectionHeader title="Content" />
        <div className="grid-2">
          <StatCard
            label="Articles Generated (Total)"
            value={articles ? fmtNum(articles.total) : '—'}
            sub="All time across all users"
          />
          <StatCard
            label="Articles This Month"
            value={articles ? fmtNum(articles.thisMonth) : '—'}
            sub={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            accent
          />
        </div>
      </div>

    </div>
  );
}