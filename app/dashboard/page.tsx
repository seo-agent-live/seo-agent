'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

const stats = [
  { label: 'Articles Generated', value: '47', delta: '+12 this week', color: '#6366f1' },
  { label: 'Avg SEO Score', value: '84', delta: '+3pts from last week', color: '#10b981' },
  { label: 'Keywords Tracked', value: '212', delta: '+18 new this week', color: '#f59e0b' },
  { label: 'Competitor Gaps', value: '31', delta: '5 new opportunities', color: '#ec4899' },
];

const recentArticles = [
  { title: '10 Best SEO Strategies for SaaS Companies in 2025', score: 92, status: 'Published', color: '#10b981' },
  { title: 'How to Build Topical Authority: A Complete Guide', score: 88, status: 'Draft', color: '#6366f1' },
  { title: 'Competitor Gap Analysis: Find Keywords You\'re Missing', score: 76, status: 'Review', color: '#f59e0b' },
  { title: 'Long-Tail Keywords: The Ultimate Playbook for 2025', score: 95, status: 'Published', color: '#10b981' },
  { title: 'Internal Linking Strategy That Doubles Your Rankings', score: 81, status: 'Draft', color: '#6366f1' },
];

const quickActions = [
  { label: 'New Article', icon: '✍️', href: '/dashboard/writer', color: '#6366f1' },
  { label: 'Research Keywords', icon: '🔍', href: '/dashboard/research', color: '#8b5cf6' },
  { label: 'Analyze Competitors', icon: '📊', href: '/dashboard/competitors', color: '#ec4899' },
  { label: 'Site Audit', icon: '🌐', href: '/dashboard/site-audit', color: '#10b981' },
];

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'rgba(255,255,255,0.95)', marginBottom: '6px', letterSpacing: '-0.5px' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Here's your SEO performance overview for the past 7 days.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {quickActions.map(action => (
          <a key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = action.color + '40'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: action.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{action.icon}</div>
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{action.label}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>{stat.label}</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'rgba(255,255,255,0.95)', letterSpacing: '-1px', marginBottom: '6px', fontFamily: 'monospace' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: stat.color }}>{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        
        {/* Recent Articles */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Recent Articles</h2>
            <a href="/dashboard/article-library" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none' }}>View all →</a>
          </div>
          {recentArticles.map((article, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < recentArticles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: article.color, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', flexShrink: 0 }}>{article.score}</span>
              <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
                background: article.status === 'Published' ? 'rgba(16,185,129,0.1)' : article.status === 'Draft' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)',
                color: article.status === 'Published' ? '#10b981' : article.status === 'Draft' ? '#a5b4fc' : '#f59e0b'
              }}>{article.status}</span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SEO Score Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Overall SEO Health</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'conic-gradient(#6366f1 84%, rgba(255,255,255,0.08) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white' }}>84</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>Good standing</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>3 items need attention</div>
              </div>
            </div>
            <a href="/dashboard/analytics" style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#a5b4fc', textDecoration: 'none' }}>View Full Report →</a>
          </div>

          {/* Top Keywords */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>Top Keywords</h3>
              <a href="/dashboard/keywords" style={{ fontSize: '11px', color: '#6366f1', textDecoration: 'none' }}>See all</a>
            </div>
            {[
              { kw: 'ai seo tools', pos: 3, change: '+2' },
              { kw: 'seo content generator', pos: 7, change: '+5' },
              { kw: 'keyword research ai', pos: 12, change: '-1' },
              { kw: 'competitor analysis tool', pos: 5, change: '+3' },
            ].map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', flex: 1 }}>{k.kw}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginRight: '10px', fontFamily: 'monospace' }}>#{k.pos}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: k.change.startsWith('+') ? '#10b981' : '#ef4444' }}>{k.change}</span>
              </div>
            ))}
          </div>

          {/* Upgrade Banner */}
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>Unlock Pro Features</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>Bulk generate, competitor snapshots & more</div>
            <a href="/pricing" style={{ display: 'block', padding: '9px', background: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#6366f1', textDecoration: 'none' }}>Upgrade to Pro →</a>
          </div>

        </div>
      </div>
    </div>
  );
}