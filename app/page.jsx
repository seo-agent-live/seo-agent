'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const features = [
  { icon: '⚡', title: 'AI Article Generator', desc: 'Turn one keyword into long-form, SERP-informed content in under 60 seconds. Human-readable, conversion-focused, ready to publish.' },
  { icon: '📊', title: 'SEO Score Checker', desc: 'Instant keyword coverage, readability, and structure analysis before you hit publish. Never guess if a page is optimised again.' },
  { icon: '🔍', title: 'Competitor Analysis', desc: 'Pull live insights from the top 10 results for any keyword. See exactly what angles are winning and why.' },
  { icon: '🗺️', title: 'Google Search Console Sync', desc: 'Connect your GSC account and track real impressions, clicks, and ranking changes — all inside SEOAgent.' },
];

const stats = [
  { value: '10x', label: 'Faster content production' },
  { value: '94%', label: 'Average SEO score on first draft' },
  { value: '3min', label: 'From keyword to full article' },
  { value: '2,000+', label: 'Content & marketing teams' },
];

const testimonials = [
  { quote: 'SEOAgent feels like content marketing cheat codes.', name: 'Brendan H.', role: 'ActiveCampaign', initials: 'BH' },
  { quote: 'We went from 2 articles a week to 14. Our organic traffic doubled in 90 days.', name: 'Sarah K.', role: 'Head of Content, Flowdesk', initials: 'SK' },
  { quote: "The competitor analysis alone is worth the price. I know exactly what to write before I start.", name: 'Marcus T.', role: 'Founder, Rankwise', initials: 'MT' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#0a0b1a', color: '#e0e0f0', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring { 0%{transform:scale(0.95);opacity:0.6} 70%{transform:scale(1.15);opacity:0} 100%{transform:scale(1.15);opacity:0} }
        .fade-1{animation:fadeUp 0.5s 0.0s ease both}
        .fade-2{animation:fadeUp 0.5s 0.1s ease both}
        .fade-3{animation:fadeUp 0.5s 0.2s ease both}
        .fade-4{animation:fadeUp 0.5s 0.3s ease both}
        .nav-link{color:#8888aa;text-decoration:none;font-size:14px;font-weight:500;transition:color 0.15s}
        .nav-link:hover{color:#e0e0f0}
        .btn-primary{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:10px;padding:14px 28px;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;text-decoration:none;display:inline-block;transition:opacity 0.15s,transform 0.12s;box-shadow:0 0 30px rgba(124,58,237,0.4)}
        .btn-primary:hover{opacity:0.9;transform:translateY(-1px)}
        .btn-secondary{background:rgba(255,255,255,0.06);color:#cccce0;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:13px 24px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;text-decoration:none;display:inline-block;transition:background 0.15s,transform 0.12s}
        .btn-secondary:hover{background:rgba(255,255,255,0.1);transform:translateY(-1px)}
        .feature-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px 24px;transition:border-color 0.2s,transform 0.2s,background 0.2s}
        .feature-card:hover{border-color:rgba(124,58,237,0.4);background:rgba(124,58,237,0.05);transform:translateY(-3px)}
        .stat-card{text-align:center;padding:28px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px}
        .testimonial-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:28px 24px;display:flex;flex-direction:column;gap:20px}
        .purple-text{background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media(max-width:900px){.grid-4{grid-template-columns:repeat(2,1fr)}.grid-3{grid-template-columns:1fr}}
        @media(max-width:600px){.grid-2,.grid-4{grid-template-columns:1fr}.hero-btns{flex-direction:column;align-items:center}}
      `}</style>

      {/* NAV */}
      <nav style={{
        position:'sticky',top:0,zIndex:100,padding:'0 32px',height:'64px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        background:scrolled?'rgba(10,11,26,0.92)':'transparent',
        backdropFilter:scrolled?'blur(12px)':'none',
        borderBottom:scrolled?'1px solid rgba(255,255,255,0.06)':'1px solid transparent',
        transition:'all 0.3s ease',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#7c3aed,#6d28d9)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'14px',fontFamily:"'Syne',sans-serif"}}>S</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:'17px',fontWeight:800,color:'#f0f0ff',letterSpacing:'-0.3px'}}>SEOAgent</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'28px'}}>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/sign-in" className="nav-link">Log in</Link>
          <Link href="/sign-up" className="btn-primary" style={{padding:'10px 20px',fontSize:'13px'}}>Start Free Trial →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:'clamp(80px,12vw,140px) 24px clamp(80px,10vw,120px)',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20%',left:'50%',transform:'translateX(-50%)',width:'800px',height:'600px',background:'radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',maxWidth:'800px',margin:'0 auto'}}>
          <div className="fade-1" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(124,58,237,0.15)',border:'1px solid rgba(124,58,237,0.3)',color:'#a78bfa',fontSize:'13px',fontWeight:600,padding:'6px 16px',borderRadius:'99px',marginBottom:'28px'}}>
            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#a78bfa',display:'inline-block',position:'relative'}}>
              <span style={{position:'absolute',inset:'-3px',borderRadius:'50%',border:'1px solid #a78bfa',animation:'pulse-ring 2s ease infinite'}}/>
            </span>
            Now with AI Visibility Scoring
          </div>
          <h1 className="fade-2" style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(42px,7vw,80px)',fontWeight:900,lineHeight:1.05,letterSpacing:'-2.5px',color:'#f0f0ff',marginBottom:'24px'}}>
            Rank on Google.<br/><span className="purple-text">Dominate with AI.</span>
          </h1>
          <p className="fade-3" style={{fontSize:'clamp(15px,2vw,18px)',color:'#7777aa',lineHeight:1.65,maxWidth:'540px',margin:'0 auto 40px'}}>
            Research live SERPs, analyze competitor angles, and publish conversion-focused content faster than ever. One agent. Unlimited results.
          </p>
          <div className="fade-4 hero-btns" style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/sign-up" className="btn-primary">Start Your Free Trial →</Link>
            <Link href="/pricing" className="btn-secondary">View pricing</Link>
          </div>
          <p className="fade-4" style={{color:'#444466',fontSize:'13px',marginTop:'16px'}}>Trusted by 2,000+ content & marketing teams · 7-day free trial · No credit card required</p>
          <div className="fade-4" style={{display:'inline-flex',alignItems:'center',gap:'10px',marginTop:'20px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'99px',padding:'8px 16px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'11px',fontWeight:700}}>BH</div>
            <span style={{color:'#8888aa',fontSize:'13px'}}><em>"SEOAgent feels like content marketing cheat codes."</em> <span style={{color:'#555577'}}>— Brendan H., ActiveCampaign</span></span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:'0 24px 100px',maxWidth:'1000px',margin:'0 auto'}}>
        <div className="grid-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'36px',fontWeight:800,background:'linear-gradient(135deg,#a78bfa,#7c3aed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',letterSpacing:'-1px',marginBottom:'6px'}}>{s.value}</div>
              <div style={{color:'#555577',fontSize:'13px',lineHeight:1.4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:'0 24px 100px',maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{color:'#a78bfa',fontSize:'12px',fontWeight:600,letterSpacing:'0.8px',textTransform:'uppercase',marginBottom:'14px'}}>Everything you need</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:800,color:'#f0f0ff',letterSpacing:'-1px'}}>One tool. The whole SEO workflow.</h2>
        </div>
        <div className="grid-2">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{fontSize:'26px',marginBottom:'16px',width:'48px',height:'48px',background:'rgba(124,58,237,0.15)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center'}}>{f.icon}</div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:'17px',fontWeight:700,color:'#f0f0ff',marginBottom:'10px'}}>{f.title}</h3>
              <p style={{color:'#555577',fontSize:'14px',lineHeight:1.65}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:'0 24px 100px',maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:800,color:'#f0f0ff',letterSpacing:'-1px'}}>Trusted by content teams everywhere</h2>
        </div>
        <div className="grid-3">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <p style={{color:'#7777aa',fontSize:'14px',lineHeight:1.7,fontStyle:'italic'}}>"{t.quote}"</p>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',fontWeight:700,flexShrink:0}}>{t.initials}</div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:600,color:'#d0d0f0'}}>{t.name}</div>
                  <div style={{fontSize:'12px',color:'#444466'}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'0 24px 100px',maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(99,102,241,0.1))',border:'1px solid rgba(124,58,237,0.3)',borderRadius:'20px',padding:'clamp(48px,6vw,72px) 40px',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-60px',left:'50%',transform:'translateX(-50%)',width:'400px',height:'200px',background:'radial-gradient(ellipse,rgba(124,58,237,0.2) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(26px,4vw,42px)',fontWeight:800,color:'#f0f0ff',letterSpacing:'-1px',marginBottom:'16px',position:'relative'}}>Ready to rank faster?</h2>
          <p style={{color:'#7777aa',fontSize:'15px',maxWidth:'400px',margin:'0 auto 32px',lineHeight:1.6,position:'relative'}}>Join thousands of marketers using SEOAgent to scale their organic growth.</p>
          <Link href="/sign-up" className="btn-primary" style={{position:'relative'}}>Start Your Free Trial →</Link>
          <p style={{color:'#333355',fontSize:'12px',marginTop:'14px'}}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'32px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'16px',color:'#a78bfa'}}>SEOAgent</div>
        <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
          {['Pricing','Privacy','Terms','Contact'].map((l) => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="nav-link" style={{fontSize:'13px'}}>{l}</Link>
          ))}
        </div>
        <div style={{color:'#333355',fontSize:'12px'}}>© {new Date().getFullYear()} SEOAgent</div>
      </footer>
    </div>
  );
}