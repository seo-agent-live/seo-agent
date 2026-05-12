'use client';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: 'Perfect for solo marketers, freelancers, and 1-person agency teams.',
    features: ['Atlas Agent: AI-powered SEO tools', '1 OTTO SEO project', '30 AI articles / month', '2,000 keyword refreshes', '1 team seat'],
    notIncluded: ['Multiple SEO projects', 'Rank tracking', 'White label'],
    color: '#1a1a2e',
    border: 'rgba(255,255,255,0.1)',
    cta: 'Get Started Free',
    href: '/sign-up',
    badge: null,
  },
  {
    name: 'Growth',
    monthlyPrice: 99,
    yearlyPrice: 79,
    desc: 'Perfect for scaling agencies and mid-sized businesses with multiple sites.',
    features: ['Everything in Starter, plus:', '2 AI SEO projects', '60 AI articles / month', '3,500 rank tracking refreshes', '3 team seats', 'Priority support'],
    notIncluded: ['White label capabilities'],
    color: '#0d1f1a',
    border: '#00e5a0',
    popular: true,
    cta: 'Start Free Trial',
    href: '/sign-up',
    badge: '⭐ Most Popular',
  },
  {
    name: 'Agency',
    monthlyPrice: 199,
    yearlyPrice: 159,
    desc: 'Perfect for high-volume agencies and large SEO teams ready to scale fast.',
    features: ['Everything in Growth, plus:', '4 AI SEO projects', 'Unlimited rank tracking', 'White label capabilities', '5 team seats', 'Dedicated account manager'],
    notIncluded: [],
    color: '#1a1a2e',
    border: 'rgba(255,255,255,0.1)',
    cta: 'Start Free Trial',
    href: '/sign-up',
    badge: null,
  },
];

const faqs = [
  { q: 'Is the Starter plan really free forever?', a: 'Yes! The Starter plan is completely free with no credit card required. Upgrade anytime when you need more.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel anytime with no questions asked. You keep access until the end of your billing period.' },
  { q: 'Do you offer a free trial on paid plans?', a: 'Yes — Growth and Agency both come with a 7-day free trial. No credit card required to start.' },
  { q: 'Can I switch plans?', a: 'Yes, upgrade or downgrade at any time. We will prorate the difference automatically.' },
  { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee if you are not satisfied.' },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: 'white' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '40px', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>S</div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>SEOAgent</span>
        </a>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/sign-in" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '7px 14px' }}>Log in</a>
          <a href="/sign-up" style={{ fontSize: '13px', fontWeight: '600', color: 'white', padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textDecoration: 'none' }}>Start Free →</a>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '80px 40px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', color: '#00e5a0', marginBottom: '24px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5a0' }} />
          Starter plan is completely free — no credit card needed
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '14px', lineHeight: 1.1 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
          Start free forever. Upgrade when you're ready to scale.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '5px' }}>
          <button onClick={() => setYearly(false)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', background: !yearly ? 'rgba(99,102,241,0.9)' : 'transparent', color: !yearly ? 'white' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', background: yearly ? 'rgba(99,102,241,0.9)' : 'transparent', color: yearly ? 'white' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Yearly
            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '10px', background: 'rgba(0,229,160,0.2)', color: '#00e5a0' }}>Save 20%</span>
          </button>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '0 48px 80px', flexWrap: 'wrap', alignItems: 'stretch', maxWidth: '1100px', margin: '0 auto' }}>
        {plans.map(plan => (
          <div key={plan.name} style={{ background: plan.color, border: `1px solid ${plan.border}`, borderRadius: '20px', padding: '36px', width: '300px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: plan.popular ? '0 0 60px rgba(0,229,160,0.1)' : 'none' }}>
            {plan.badge && (
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#00e5a0', borderRadius: '20px', padding: '4px 16px', fontSize: '11px', fontWeight: '700', color: '#000', whiteSpace: 'nowrap' }}>
                {plan.badge}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>
                {plan.name === 'Starter' ? '🆓' : plan.name === 'Growth' ? '⚡' : '🏢'}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', margin: 0 }}>{plan.desc}</p>
            </div>

            <div style={{ marginBottom: '8px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                <span style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-2px' }}>
                  {plan.monthlyPrice === 0 ? 'Free' : `£${yearly ? plan.yearlyPrice : plan.monthlyPrice}`}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>/month</span>
                )}
              </div>
              {plan.monthlyPrice > 0 && yearly && (
                <div style={{ fontSize: '12px', color: '#00e5a0' }}>
                  Billed yearly · Save £{(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                </div>
              )}
              {plan.monthlyPrice === 0 && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>No credit card required</div>
              )}
              {plan.monthlyPrice > 0 && !yearly && (
                <div style={{ background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: '#00e5a0', display: 'inline-block', marginTop: '8px' }}>
                  Free for 7 days
                </div>
              )}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 28px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                  <span style={{ color: '#00e5a0', fontSize: '14px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {f}
                </li>
              ))}
              {plan.notIncluded.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✕</span>
                  {f}
                </li>
              ))}
            </ul>

            <a href={plan.href} style={{ display: 'block', textAlign: 'center', padding: '15px', borderRadius: '12px', background: plan.popular ? '#00e5a0' : plan.monthlyPrice === 0 ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.08)', color: plan.popular ? '#000' : 'white', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: plan.popular || plan.monthlyPrice === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
              {plan.cta} →
            </a>
          </div>
        ))}
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ textAlign: 'center', padding: '0 48px 80px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>Trusted by 2,000+ content teams worldwide</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {['ActiveCampaign', 'HubSpot', 'Shopify', 'Notion', 'Webflow'].map(brand => (
            <span key={brand} style={{ fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.12)', letterSpacing: '-0.3px' }}>{brand}</span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 100px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: '800', textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.5px' }}>
          Frequently asked questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: '500', textAlign: 'left', gap: '16px' }}>
              {faq.q}
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '22px', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </button>
            {openFaq === i && (
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, paddingBottom: '20px', margin: 0 }}>{faq.a}</p>
            )}
          </div>
        ))}
      </section>

    </main>
  );
}