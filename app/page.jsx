'use client';
import Link from 'next/link';
import { useState } from 'react';

const navItems = {
  'Product': {
    items: [
      { label: 'Platform Overview', href: '/product/overview' },
      { label: 'AI Agent', href: '/product/ai-agent' },
      { label: 'AI Search Tracking', href: '/product/ai-search-tracking' },
      { label: 'Content Guard', href: '/product/content-guard' },
      { label: 'Content Monitoring', href: '/product/content-monitoring' },
      { label: 'Integrations', href: '/product/integrations' },
    ]
  },
  'Solutions': {
    items: [
      { label: 'For Content Marketers', href: '/solutions/content-marketers' },
      { label: 'For SEO Teams', href: '/solutions/seo-teams' },
      { label: 'For Agencies', href: '/solutions/agencies' },
      { label: 'For Enterprises', href: '/solutions/enterprises' },
      { label: 'Case Studies', href: '/solutions/case-studies' },
    ]
  },
  'Resources': {
    items: [
      { label: 'Blog', href: '/resources/blog' },
      { label: 'SEO + GEO Guide', href: '/resources/seo-geo-guide' },
      { label: 'Free SEO Tools', href: '/resources/free-seo-tools' },
      { label: 'AI Visibility Checker', href: '/resources/ai-visibility-checker' },
      { label: 'Compare', href: '/resources/compare' },
    ]
  },
};

export default function HomePage() {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', background: '#0f0c2e', minHeight: '100vh', color: 'white' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,12,46,0.97)', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '40px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>S</div>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.3px' }}>SEOAgent</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', flex: 1, position: 'relative' }}>
          {Object.keys(navItems).map(key => (
            <div key={key} style={{ position: 'relative' }}
              onMouseEnter={() => setOpenMenu(key)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {key} ▾
              </span>
              {openMenu === key && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#1a1740', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', minWidth: '200px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                  {navItems[key].items.map(item => (
                    <Link key={item.href} href={item.href} style={{ display: 'block', padding: '9px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '6px', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/pricing" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none' }}>Pricing</Link>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/sign-in" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '7px 14px' }}>Log in</Link>
          <Link href="/sign-up" style={{ fontSize: '13px', fontWeight: '600', color: 'white', padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none' }}>Start Free Trial →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '90px 40px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', color: '#a5b4fc', marginBottom: '28px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
          Now with AI Visibility Scoring
        </div>
        <h1 style={{ fontSize: '62px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-2px', marginBottom: '12px' }}>
          Rank on Google.<br />
          <span style={{ color: '#7c6af7' }}>Dominate with AI.</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '540px', margin: '0 auto 40px', lineHeight: '1.7', fontWeight: '300' }}>
          Research live SERPs, analyze competitor angles, and publish conversion-focused content faster than ever. One agent. Unlimited results.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
          <Link href="/sign-up" style={{ fontSize: '15px', fontWeight: '600', color: 'white', padding: '15px 30px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none' }}>Start Your Free Trial →</Link>
          <button style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', padding: '15px 30px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: 'inherit' }}>Watch demo</button>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>
          Trusted by 2,000+ content & marketing teams · 7-day free trial · No credit card required
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600', color: 'white' }}>BH</div>
          <em>"SEOAgent feels like content marketing cheat codes."</em>
          <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.6)' }}>— Brendan H., ActiveCampaign</span>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>Everything you need</p>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '8px' }}>The full SEO stack, powered by AI</h2>
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '40px' }}>From research to publishing — SEOAgent handles the entire workflow.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '960px', margin: '0 auto' }}>
          {[
            { icon: '✍️', color: 'rgba(99,102,241,0.15)', title: 'AI Article Generator', desc: 'Turn one keyword into long-form, human-readable, SERP-informed content in seconds.', href: '/dashboard/writer' },
            { icon: '📊', color: 'rgba(16,185,129,0.15)', title: 'SEO Score Checker', desc: 'Review keyword coverage, structure, and readability before you publish anything.', href: '/dashboard/analytics' },
            { icon: '🔍', color: 'rgba(236,72,153,0.15)', title: 'Competitor Analysis', desc: 'Extract top competitor insights from live search results in seconds.', href: '/dashboard/competitors' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', marginBottom: '14px' }}>{f.desc}</p>
              <Link href={f.href} style={{ fontSize: '12px', color: '#8b5cf6', textDecoration: 'none' }}>Explore →</Link>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}