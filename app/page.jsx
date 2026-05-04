'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const features = [
  {
    icon: '⚡',
    title: 'AI Article Generator',
    desc: 'Turn one keyword into long-form, SERP-informed content in under 60 seconds. Human-readable, conversion-focused, ready to publish.',
  },
  {
    icon: '📊',
    title: 'SEO Score Checker',
    desc: 'Instant keyword coverage, readability, and structure analysis before you hit publish. Never guess if a page is optimised again.',
  },
  {
    icon: '🔍',
    title: 'Competitor Analysis',
    desc: 'Pull live insights from the top 10 results for any keyword. See exactly what angles are winning and why.',
  },
  {
    icon: '🗺️',
    title: 'Google Search Console Sync',
    desc: 'Connect your GSC account and track real impressions, clicks, and ranking changes — all inside SEOAgent.',
  },
];

const stats = [
  { value: '10x', label: 'Faster content production' },
  { value: '94%', label: 'Average SEO score on first draft' },
  { value: '3min', label: 'From keyword to full article' },
  { value: '2,400+', label: 'Marketers using SEOAgent' },
];

const testimonials = [
  {
    quote: 'We went from 2 articles a week to 14. Our organic traffic doubled in 90 days.',
    name: 'Sarah K.',
    role: 'Head of Content, Flowdesk',
    initials: 'SK',
  },
  {
    quote: "The competitor analysis alone is worth the price. I know exactly what to write before I start.",
    name: 'Marcus T.',
    role: 'Founder, Rankwise',
    initials: 'MT',
  },
  {
    quote: "Best SEO tool I've used. The output actually sounds like a human wrote it.",
    name: 'Priya M.',
    role: 'SEO Lead, Notion',
    initials: 'PM',
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      background: '#080808',
      color: '#e0e0e0',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.6; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .fade-1 { animation: fadeUp 0.5s 0.0s ease both; }
        .fade-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .fade-4 { animation: fadeUp 0.5s 0.3s ease both; }
        .fade-5 { animation: fadeUp 0.5s 0.4s ease both; }

        .nav-link {
          color: #555;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #e0e0e0; }

        .btn-primary {
          background: #00e5a0;
          color: #080808;
          border: none;
          border-radius: 10px;
          padding: 13px 26px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.15s, transform 0.12s;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        .btn-secondary {
          background: transparent;
          color: #888;
          border: 1.5px solid #222;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: border-color 0.15s, color 0.15s, transform 0.12s;
        }
        .btn-secondary:hover { border-color: #444; color: #ccc; transform: translateY(-1px); }

        .feature-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 28px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover { border-color: #2a2a2a; transform: translateY(-3px); }

        .stat-card {
          text-align: center;
          padding: 28px 20px;
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
        }

        .testimonial-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #00e5a0 0%, #7fffd4 40%, #00e5a0 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .grid-3 { grid-template-columns: 1fr; }
          .hero-btns { flex-direction: column; align-items: center; }
        }
        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #151515' : '1px solid transparent',
        transition: 'all 0.3s ease',
        maxWidth: '100%',
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '19px',
          fontWeight: 800,
          color: '#00e5a0',
          letterSpacing: '-0.5px',
        }}>
          SEOAgent
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/sign-in" className="nav-link">Sign in</Link>
          <Link href="/sign-up" className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        padding: 'clamp(80px, 12vw, 140px) 24px clamp(80px, 10vw, 120px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,229,160,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          <div className="fade-1" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0d2419',
            border: '1px solid #1a3a28',
            color: '#00e5a0',
            fontSize: '12px',
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: '99px',
            marginBottom: '28px',
            letterSpacing: '0.4px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#00e5a0',
              display: 'inline-block',
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', inset: '-3px',
                borderRadius: '50%',
                border: '1px solid #00e5a0',
                animation: 'pulse-ring 2s ease infinite',
              }} />
            </span>
            Now with Google Search Console sync
          </div>

          <h1 className="fade-2" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(38px, 7vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            color: '#f0f0f0',
            marginBottom: '24px',
          }}>
            Generate SEO articles<br />
            <span className="shimmer-text">in seconds, not hours</span>
          </h1>

          <p className="fade-3" style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#555',
            lineHeight: 1.65,
            maxWidth: '520px',
            margin: '0 auto 40px',
          }}>
            Research live SERPs, analyse competitor angles, and publish conversion-focused content faster than your competition ever could.
          </p>

          <div className="fade-4 hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-primary" style={{ fontSize: '15px', padding: '15px 32px' }}>
              Start for free →
            </Link>
            <Link href="/pricing" className="btn-secondary" style={{ fontSize: '15px', padding: '14px 28px' }}>
              View pricing
            </Link>
          </div>

          <p className="fade-5" style={{ color: '#333', fontSize: '12px', marginTop: '16px' }}>
            No credit card required · 3 free articles per day
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="grid-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '36px',
                fontWeight: 800,
                color: '#00e5a0',
                letterSpacing: '-1px',
                marginBottom: '6px',
              }}>
                {s.value}
              </div>
              <div style={{ color: '#444', fontSize: '13px', lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            color: '#00e5a0',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            Everything you need
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: '#f0f0f0',
            letterSpacing: '-1px',
          }}>
            One tool. The whole SEO workflow.
          </h2>
        </div>
        <div className="grid-2">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{
                fontSize: '26px',
                marginBottom: '16px',
                width: '48px',
                height: '48px',
                background: '#0d2419',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '17px',
                fontWeight: 700,
                color: '#f0f0f0',
                marginBottom: '10px',
              }}>
                {f.title}
              </h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            color: '#00e5a0',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            What people are saying
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: '#f0f0f0',
            letterSpacing: '-1px',
          }}>
            Trusted by content teams everywhere
          </h2>
        </div>
        <div className="grid-3">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7, fontStyle: 'italic' }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: '#0d2419',
                  color: '#00e5a0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#d0d0d0' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#444' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          background: '#0b1a13',
          border: '1px solid #1a3a28',
          borderRadius: '20px',
          padding: 'clamp(48px, 6vw, 72px) 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '400px', height: '200px',
            background: 'radial-gradient(ellipse, rgba(0,229,160,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 800,
            color: '#f0f0f0',
            letterSpacing: '-1px',
            marginBottom: '16px',
            position: 'relative',
          }}>
            Ready to rank faster?
          </h2>
          <p style={{
            color: '#555', fontSize: '15px', marginBottom: '32px',
            maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6,
            position: 'relative',
          }}>
            Join thousands of marketers using SEOAgent to scale their organic growth.
          </p>
          <Link href="/sign-up" className="btn-primary" style={{
            fontSize: '15px', padding: '15px 36px', position: 'relative',
          }}>
            Get started for free →
          </Link>
          <p style={{ color: '#2a4a38', fontSize: '12px', marginTop: '14px' }}>
            No credit card · Cancel anytime
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #111',
        padding: '32px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '16px',
          color: '#00e5a0',
        }}>
          SEOAgent
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {['Pricing', 'Privacy', 'Terms', 'Contact'].map((l) => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="nav-link" style={{ fontSize: '13px' }}>
              {l}
            </Link>
          ))}
        </div>
        <div style={{ color: '#2a2a2a', fontSize: '12px' }}>
          © {new Date().getFullYear()} SEOAgent
        </div>
      </footer>

    </div>
  );
}