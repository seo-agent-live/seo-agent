"use client";
import Link from 'next/link';

const plans = [
  {
    name: "Starter",
    price: "$99",
    desc: "Perfect for solo marketers, freelancers, and 1-person agency teams.",
    features: ["Atlas Agent: AI-powered SEO tools", "1 OTTO SEO project", "30 AI articles / month", "2,000 keyword refreshes", "1 team seat"],
    color: "#1a1a2e",
    border: "rgba(255,255,255,0.1)",
  },
  {
    name: "Growth",
    price: "$199",
    desc: "Perfect for scaling agencies and mid-sized businesses with multiple sites.",
    features: ["Everything in Starter Plan, plus:", "2 AI SEO projects", "60 AI articles / month", "3,500 rank tracking refreshes", "3 team seats"],
    color: "#0d1f1a",
    border: "#00e5a0",
    popular: true,
  },
  {
    name: "Agency",
    price: "$399",
    desc: "Perfect for high-volume agencies and large SEO teams ready to scale fast.",
    features: ["Everything in Growth Plan, plus:", "4 AI SEO projects", "Unlimited rank tracking", "White Label capabilities", "5 team seats"],
    color: "#1a1a2e",
    border: "rgba(255,255,255,0.1)",
  },
];

export default function PricingPage() {
  return (
    <main style={{ fontFamily: 'Inter, sans-serif', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '40px', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>S</div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>SEOAgent</span>
        </Link>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/sign-in" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '7px 14px' }}>Log in</Link>
          <Link href="/sign-up" style={{ fontSize: '13px', fontWeight: '600', color: 'white', padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none' }}>Start Free Trial →</Link>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '80px 40px 60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '16px' }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto 40px' }}>Start free for 7 days. No credit card required.</p>
      </section>

      {/* PLANS */}
      <section style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '0 48px 80px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {plans.map(plan => (
          <div key={plan.name} style={{
            background: plan.color,
            border: `1px solid ${plan.border}`,
            borderRadius: '20px',
            padding: '36px',
            width: '320px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#00e5a0', borderRadius: '20px', padding: '4px 16px', fontSize: '12px', fontWeight: '700', color: '#000', whiteSpace: 'nowrap' }}>
                Most Popular
              </div>
            )}
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', lineHeight: '1.6' }}>{plan.desc}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '52px', fontWeight: '800' }}>{plan.price}</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>/month</span>
            </div>
            <div style={{ background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#00e5a0', display: 'inline-block', marginBottom: '28px', width: 'fit-content' }}>
              Free for 7 days
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
                  <span style={{ color: '#00e5a0', fontSize: '16px', fontWeight: '700' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" style={{
              display: 'block',
              textAlign: 'center',
              padding: '16px',
              borderRadius: '12px',
              background: plan.popular ? '#00e5a0' : 'rgba(255,255,255,0.08)',
              color: plan.popular ? '#000' : 'white',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '15px',
              border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
            }}>
              Start Free Trial
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}