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
    <main style={{ fontFamily: "'Inter', sans-serif", background: '#07051a', minHeight: '100vh', color: 'white', overflowX: 'hidden', position: 'relative' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes orb1 {
          0%   { transform: translate(0px, 0px); }
          25%  { transform: translate(120px, -100px); }
          50%  { transform: translate(60px, 80px); }
          75%  { transform: translate(-80px, -60px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes orb2 {
          0%   { transform: translate(0px, 0px); }
          25%  { transform: translate(-100px, 80px); }
          50%  { transform: translate(80px, 120px); }
          75%  { transform: translate(60px, -80px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes orb3 {
          0%   { transform: translate(0px, 0px); }
          33%  { transform: translate(80px, 100px); }
          66%  { transform: translate(-60px, 60px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes orb4 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-100px, -80px) scale(1.3); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 20px rgba(99,102,241,0.45);
        }
        .btn-primary:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 0 30px rgba(124,106,247,0.9), 0 0 60px rgba(124,106,247,0.45), 0 12px 30px rgba(0,0,0,0.4);
        }

        .btn-ghost {
          transition: transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s, background 0.3s;
        }
        .btn-ghost:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 0 20px rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.35) !important;
          background: rgba(255,255,255,0.1) !important;
        }

        .feature-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(139,92,246,0.5) !important;
          box-shadow: 0 0 40px rgba(99,102,241,0.2), 0 20px 50px rgba(0,0,0,0.4);
        }

        .nav-cta {
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 12px rgba(99,102,241,0.35);
        }
        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(124,106,247,0.7), 0 0 40px rgba(124,106,247,0.3);
        }

        .fade1 { animation: fadeUp 0.7s 0s ease both; }
        .fade2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade4 { animation: fadeUp 0.7s 0.45s ease both; }
        .fade5 { animation: fadeUp 0.7s 0.6s ease both; }

        .badge {
          background: linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.4) 40%, rgba(99,102,241,0.2) 80%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      {/* ── BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>

        {/* Animated gradient mesh base */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(45deg, #07051a 0%, #1a0a3c 20%, #0d1a4a 40%, #1a0730 60%, #07051a 80%, #120a3a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
        }} />

        {/* Orb 1 — massive bright purple, top-left */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orb1 12s ease-in-out infinite',
        }} />

        {/* Orb 2 — violet, top-right */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-100px',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0.18) 40%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'orb2 16s ease-in-out infinite',
        }} />

        {/* Orb 3 — pink, center-right */}
        <div style={{
          position: 'absolute', top: '30%', right: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0.12) 45%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orb3 20s ease-in-out infinite',
        }} />

        {/* Orb 4 — deep indigo, bottom */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '25%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.45) 0%, rgba(79,70,229,0.15) 45%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'orb4 14s ease-in-out infinite',
        }} />

        {/* Orb 5 — teal accent, bottom-right */}
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.08) 45%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orb3 18s 3s ease-in-out infinite',
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(7,5,26,0.8)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '40px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', boxShadow: '0 0 14px rgba(99,102,241,0.6)' }}>S</div>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.3px' }}>SEOAgent</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', flex: 1, position: 'relative' }}>
          {Object.keys(navItems).map(key => (
            <div key={key} style={{ position: 'relative' }}
              onMouseEnter={() => setOpenMenu(key)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {key} ▾
              </span>
              {openMenu === key && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'rgba(12,9,40,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', minWidth: '200px', boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15)' }}>
                  {navItems[key].items.map(item => (
                    <Link key={item.href} href={item.href} style={{ display: 'block', padding: '9px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', borderRadius: '6px', transition: 'background 0.15s, color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/pricing" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >Pricing</Link>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/sign-in" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '7px 14px', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          >Log in</Link>
          <Link href="/sign-up" className="nav-cta" style={{ fontSize: '13px', fontWeight: '600', color: 'white', padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none', display: 'inline-block' }}>Start Free Trial →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '110px 40px 80px', position: 'relative', zIndex: 1 }}>
        <div className="fade1 badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '20px', padding: '5px 16px', fontSize: '12px', color: '#a5b4fc', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 8px #818cf8' }} />
          Now with AI Visibility Scoring
        </div>

        <h1 className="fade2" style={{ fontSize: '72px', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-3px', marginBottom: '20px' }}>
          Rank on Google.<br />
          <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Dominate with AI.
          </span>
        </h1>

        <p className="fade3" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto 48px', lineHeight: '1.75', fontWeight: '300' }}>
          Research live SERPs, analyze competitor angles, and publish conversion-focused content faster than ever. One agent. Unlimited results.
        </p>

        <div className="fade4" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '30px' }}>
          <Link href="/sign-up" className="btn-primary" style={{ fontSize: '15px', fontWeight: '600', color: 'white', padding: '16px 34px', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' }}>
            Start Your Free Trial →
          </Link>
          <button className="btn-ghost" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', padding: '16px 34px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Watch demo
          </button>
        </div>

        <p className="fade5" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.28)', marginBottom: '16px' }}>
          Trusted by 2,000+ content & marketing teams · 7-day free trial · No credit card required
        </p>

        <div className="fade5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: 'white', boxShadow: '0 0 12px rgba(99,102,241,0.5)' }}>BH</div>
          <em style={{ color: 'rgba(255,255,255,0.5)' }}>"SEOAgent feels like content marketing cheat codes."</em>
          <span style={{ fontWeight: '600', color: 'rgba(255,255,255,0.65)' }}>— Brendan H., ActiveCampaign</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 48px 120px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: '14px' }}>Everything you need</p>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.8px', marginBottom: '12px' }}>The full SEO stack, powered by AI</h2>
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.35)', marginBottom: '52px' }}>From research to publishing — SEOAgent handles the entire workflow.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '980px', margin: '0 auto' }}>
          {[
            { icon: '✍️', colorBg: 'rgba(99,102,241,0.2)', glow: 'rgba(99,102,241,0.5)', title: 'AI Article Generator', desc: 'Turn one keyword into long-form, human-readable, SERP-informed content in seconds.', href: '/dashboard/writer' },
            { icon: '📊', colorBg: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.5)', title: 'SEO Score Checker', desc: 'Review keyword coverage, structure, and readability before you publish anything.', href: '/dashboard/analytics' },
            { icon: '🔍', colorBg: 'rgba(236,72,153,0.2)', glow: 'rgba(236,72,153,0.5)', title: 'Competitor Analysis', desc: 'Extract top competitor insights from live search results in seconds.', href: '/dashboard/competitors' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: f.colorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '18px', boxShadow: `0 0 24px ${f.glow}` }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: 'rgba(255,255,255,0.9)' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', marginBottom: '18px' }}>{f.desc}</p>
              <Link href={f.href} style={{ fontSize: '12px', color: '#a78bfa', textDecoration: 'none', fontWeight: '500', transition: 'color 0.15s, letter-spacing 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#a78bfa'; }}
              >Explore →</Link>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}