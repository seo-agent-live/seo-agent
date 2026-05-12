'use client';
import { useState } from 'react';
import Link from 'next/link';

const checklist = [
  { id: 1, title: 'Complete your profile', desc: 'Add your name and preferences in Settings', href: '/dashboard/settings', done: false },
  { id: 2, title: 'Run your first AI article', desc: 'Generate a full SEO article with one keyword', href: '/dashboard/writer', done: false },
  { id: 3, title: 'Analyze your competitors', desc: 'See what the top pages are doing differently', href: '/dashboard/competitors', done: false },
  { id: 4, title: 'Track your keywords', desc: 'Add keywords to monitor your rankings', href: '/dashboard/keywords', done: false },
  { id: 5, title: 'Check your SEO score', desc: 'Review your content quality and structure', href: '/dashboard/analytics', done: false },
];

const features = [
  { icon: '✍️', title: 'AI Writer', desc: 'Generate long-form, SERP-informed articles in seconds with one keyword.', href: '/dashboard/writer', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' },
  { icon: '🔍', title: 'Research', desc: 'Discover high-value keywords and content gaps in your niche.', href: '/dashboard/research', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  { icon: '📊', title: 'SEO Analytics', desc: 'Track performance, scores, and improvements over time.', href: '/dashboard/analytics', color: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)' },
  { icon: '🏆', title: 'Competitor Analysis', desc: 'Extract insights from top-ranking competitor pages instantly.', href: '/dashboard/competitors', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  { icon: '🎯', title: 'Keyword Tracker', desc: 'Monitor keyword rankings and spot new opportunities.', href: '/dashboard/keywords', color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)' },
  { icon: '📝', title: 'Content Templates', desc: 'Use proven templates to create consistent, high-quality content.', href: '/dashboard/templates', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
];

const steps = [
  { step: '01', title: 'Enter a keyword', desc: 'Start with any keyword or topic you want to rank for. SEOAgent will research live SERPs instantly.' },
  { step: '02', title: 'AI generates your article', desc: 'Get a full long-form article optimized for your keyword, complete with headings, meta, and structure.' },
  { step: '03', title: 'Review your SEO score', desc: 'Check your content score and make improvements before publishing.' },
  { step: '04', title: 'Publish and track', desc: 'Publish your content and monitor your keyword rankings over time.' },
];

export default function QuickStartPage() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      
      {/* Header */}
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Quick Start
      </h1>
      <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '15px' }}>
        Get up and running with SEOAgent in minutes.
      </p>

      {/* Checklist */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Getting Started Checklist</h2>
          <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>{completedCount}/{checklist.length} completed</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(completedCount / checklist.length) * 100}%`, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
        </div>
        {checklist.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', background: checked[item.id] ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: checked[item.id] ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid', borderColor: checked[item.id] ? '#6366f1' : 'rgba(255,255,255,0.2)', background: checked[item.id] ? '#6366f1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              {checked[item.id] && <span style={{ fontSize: '11px', color: 'white' }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: checked[item.id] ? '#64748b' : '#e2e8f0', textDecoration: checked[item.id] ? 'line-through' : 'none' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{item.desc}</div>
            </div>
            <Link href={item.href} onClick={e => e.stopPropagation()} style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', padding: '6px 12px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', whiteSpace: 'nowrap' }}>
              Go →
            </Link>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {steps.map(s => (
            <div key={s.step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'rgba(99,102,241,0.3)', marginBottom: '12px', fontFamily: 'monospace' }}>{s.step}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>Explore Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {features.map(f => (
            <Link key={f.title} href={f.href} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: `1px solid ${f.border}`, borderRadius: '14px', padding: '20px', display: 'block', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}>{f.title}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}