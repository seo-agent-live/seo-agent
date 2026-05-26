'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

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
    <main style={{ fontFamily: "'Inter', sans-serif", background: '#080618', minHeight: '100vh', color: 'white', overflow: 'hidden', position: 'relative' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* Animated gradient mesh background */
        @keyframes meshShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Glowing orb animations */
        @keyframes orbFloat1 {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0.6; }
          33%  { transform: translate(60px, -80px) scale(1.1); opacity: 0.8; }
          66%  { transform: translate(-40px, 40px) scale(0.95); opacity: 0.5; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.6; }
        }
        @keyframes orbFloat2 {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
          33%  { transform: translate(-70px, 50px) scale(1.15); opacity: 0.7; }
          66%  { transform: translate(50px, -60px) scale(0.9); opacity: 0.4; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
        }
        @keyframes orbFloat3 {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0.4; }
          50%  { transform: translate(30px, 70px) scale(1.2); opacity: 0.65; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.4; }
        }
        @keyframes orbFloat4 {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          40%  { transform: translate(-50px, -40px) scale(1.1); opacity: 0.55; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
        }

        /* Glow pulse button */
        .btn-glow {
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
        }
        .btn-glow:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 24px rgba(124, 106, 247, 0.7), 0 0 48px rgba(124, 106, 247, 0.35), 0 8px 24px rgba(0,0,0,0.4);
        }
        .btn-glow:active {
          transform: translateY(0px) scale(0.99);
        }

        .btn-ghost-glow {
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .btn-ghost-glow:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 18px rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.3) !important;
          background: rgba(255,255,255,0.08) !important;
        }

        .nav-link-hover {
          transition: color 0.15s ease, background 0.15s ease;
        }
        .nav-link-hover:hover {
          color: rgba(255,255,255,0.95) !important;
          background: rgba(255,255,255,0.07);
          border-radius: 6px;
        }

        .feature-card {
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(124,106,247,0.35) !important;
          box-shadow: 0 0 30px rgba(124,106,247,0.15), 0 12px 40px rgba(0,0,0,0.3);
        }

        .explore-link {
          transition: color 0.15s, letter-spacing 0.15s;
        }
        .explore-link:hover {
          color: #a78bfa !important;
          letter-spacing: 0.02em;
        }

        /* Fade-in on load */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .fade-up-5 { animation: fadeUp 0.7s 0.6s ease both; }

        /* Shimmer on badge */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .badge-shimmer {
          background: linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.3) 40%, rgba(99,102,241,0.15) 80%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* ── ANIMATED BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>

        {/* Gradient mesh layer */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #080618 0%, #0e0b2e 25%, #130d3a 50%, #0a0720 75%, #080618 100%)',
          backgroundSize: '400% 400%',
          animation: 'meshShift 15s ease infinite',
        }} />

        {/* Orb 1 — large purple, top left */}
        <div style={{
          position: 'absolute', top: '5%', left: '10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat1 18s ease-in-out infinite',
        }} />

        {/* Orb 2 — large violet, top right */}
        <div style={{
          position: 'absolute', top: '-5%', right: '5%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orbFloat2 22s ease-in-out infinite',
        }} />

        {/* Orb 3 — pink/fuchsia, mid right */}
        <div style={{
          position: 'absolute', top: '40%', right: '15%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0.04) 50%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'orbFloat3 25s ease-in-out infinite',
        }} />

        {/* Orb 4 — indigo, bottom left */}
        <div style={{
          position: 'absolute', bottom: '10%', left: '20%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.25) 0%, rgba(79,70,229,0.05) 50%, transparent 70%)',
          filter: 'blur(45px)',
          animation: 'orbFloat4 20s ease-in-out infinite',
        }} />

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Noise grain overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,6,24,0.85)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '40px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', boxShadow: '0 0 12px rgba(99,102,241,0.5)' }}>S</div>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.3px' }}>SEOAgent</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', flex: 1, position: 'relative' }}>
          {Object.keys(navItems).map(key => (
            <div key={key} style={{ position: 'relative' }}
              onMouseEnter={() => setOpenMenu(key)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="nav-link-hover" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {key} ▾
              </span>
              {openMenu === key && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'rgba(18,14,52,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', minWidth: '200px', boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)' }}>
                  {navItems[key].items.map(item => (
                    <Link key={item.href} href={item.href} style={{ display: 'block', padding: '9px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '6px', transition: 'background 0.15s, color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/pricing" className="nav-link-hover" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none' }}>Pricing</Link>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/sign-in" className="nav-link-hover" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '7px 14px', borderRadius: '6px' }}>Log in</Link>
          <Link href="/sign-up" className="btn-glow" style={{ fontSize: '13px', fontWeight: '600', color: 'white', padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none', display: 'inline-block' }}>Start Free Trial →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '100px 40px 70px', position: 'relative', zIndex: 1 }}>
        <div className="fade-up-1 badge-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', color: '#a5b4fc', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 6px #6366f1' }} />
          Now with AI Visibility Scoring
        </div>

        <h1 className="fade-up-2" style={{ fontSize: '68px', fontWeight: '800', lineHeight: '1.08', letterSpacing: '-2.5px', marginBottom: '16px' }}>
          Rank on Google.<br />
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Dominate with AI.
          </span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto 44px', lineHeight: '1.75', fontWeight: '300' }}>
          Research live SERPs, analyze competitor angles, and publish conversion-focused content faster than ever. One agent. Unlimited results.
        </p>

        <div className="fade-up-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '28px' }}>
          <Link href="/sign-up" className="btn-glow" style={{ fontSize: '15px', fontWeight: '600', color: 'white', padding: '15px 32px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
            Start Your Free Trial →
          </Link>
          <button className="btn-ghost-glow" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', padding: '15px 32px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Watch demo
          </button>
        </div>

        <p className="fade-up-5" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.28)', marginBottom: '14px' }}>
          Trusted by 2,000+ content & marketing teams · 7-day free trial · No credit card required
        </p>

        <div className="fade-up-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600', color: 'white', boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}>BH</div>
          <em>"SEOAgent feels like content marketing cheat codes."</em>
          <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.55)' }}>— Brendan H., ActiveCampaign</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '70px 48px 100px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>Everything you need</p>
        <h2 style={{ textAlign: 'center', fontSize: '34px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '10px' }}>The full SEO stack, powered by AI</h2>
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'rgba(255,255,255,0.35)', marginBottom: '48px' }}>From research to publishing — SEOAgent handles the entire workflow.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', maxWidth: '960px', margin: '0 auto' }}>
          {[
            { icon: '✍️', color: 'rgba(99,102,241,0.2)', glow: 'rgba(99,102,241,0.3)', title: 'AI Article Generator', desc: 'Turn one keyword into long-form, human-readable, SERP-informed content in seconds.', href: '/dashboard/writer' },
            { icon: '📊', color: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.3)', title: 'SEO Score Checker', desc: 'Review keyword coverage, structure, and readability before you publish anything.', href: '/dashboard/analytics' },
            { icon: '🔍', color: 'rgba(236,72,153,0.2)', glow: 'rgba(236,72,153,0.3)', title: 'Competitor Analysis', desc: 'Extract top competitor insights from live search results in seconds.', href: '/dashboard/competitors' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px', boxShadow: `0 0 20px ${f.glow}` }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: 'rgba(255,255,255,0.9)' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', marginBottom: '16px' }}>{f.desc}</p>
              <Link href={f.href} className="explore-link" style={{ fontSize: '12px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '500' }}>Explore →</Link>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}