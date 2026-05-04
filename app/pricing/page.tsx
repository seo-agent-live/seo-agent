'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for trying out the workflow.',
    cta: 'Get Started Free',
    ctaHref: '/sign-up',
    highlight: false,
    features: [
      '3 articles per day',
      'Basic SEO scoring',
      'Keyword research',
      'Community support',
    ],
    monthlyPriceId: null,
    annualPriceId: null,
  },
  {
    name: 'Pro',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'Built for creators and marketers who publish consistently.',
    cta: 'Start Pro',
    ctaHref: null,
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited articles',
      'Advanced SEO scoring',
      'Competitor analysis',
      'Priority generation speed',
      'Google Search Console sync',
      'Email support',
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
  },
  {
    name: 'Agency',
    monthlyPrice: 99,
    annualPrice: 79,
    description: 'Scale content operations across multiple clients.',
    cta: 'Start Agency',
    ctaHref: null,
    highlight: false,
    features: [
      'Everything in Pro',
      'Multi-user seats (up to 10)',
      'Competitor snapshots',
      'White-label exports',
      'Analytics dashboard',
      'Priority support',
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || '',
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || '',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  async function handleCheckout(plan: typeof plans[0]) {
    if (plan.ctaHref) {
      router.push(plan.ctaHref);
      return;
    }
    const priceId = annual ? plan.annualPriceId : plan.monthlyPriceId;
    if (!priceId) return;

    setLoading(plan.name);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#e0e0e0',
      fontFamily: "'DM Sans', sans-serif",
      padding: '80px 24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pricing-hero { animation: fadeUp 0.4s ease both; }
        .pricing-cards { animation: fadeUp 0.4s 0.1s ease both; }

        .toggle-wrap {
          display: inline-flex;
          align-items: center;
          background: #111;
          border: 1px solid #222;
          border-radius: 99px;
          padding: 4px;
          gap: 4px;
        }
        .toggle-opt {
          padding: 7px 18px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, color 0.2s;
        }
        .toggle-opt.active { background: #00e5a0; color: #0a0a0a; }
        .toggle-opt:not(.active) { background: transparent; color: #555; }

        .plan-card {
          background: #111;
          border: 1.5px solid #1e1e1e;
          border-radius: 16px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, transform 0.2s;
          flex: 1;
          min-width: 0;
        }
        .plan-card:hover { border-color: #2a2a2a; transform: translateY(-2px); }
        .plan-card.highlight { border-color: #00e5a0; background: #0b1a13; }
        .plan-card.highlight:hover { border-color: #00e5a0; }

        .plan-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.12s;
          border: none;
          margin-top: auto;
        }
        .plan-btn.primary { background: #00e5a0; color: #0a0a0a; }
        .plan-btn.secondary { background: transparent; color: #888; border: 1.5px solid #222; }
        .plan-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .plan-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #888;
          padding: 5px 0;
        }
        .check {
          width: 16px; height: 16px; border-radius: 50%;
          background: #0d2419;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .badge {
          display: inline-block;
          background: #00e5a0; color: #0a2015;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
          margin-bottom: 12px; letter-spacing: 0.3px;
        }
        .savings-pill {
          display: inline-block;
          background: #0d2419; color: #00e5a0;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
          margin-left: 8px; vertical-align: middle;
        }
        @media (max-width: 768px) { .cards-grid { flex-direction: column !important; } }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="pricing-hero" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block', background: '#0d2419', color: '#00e5a0',
            fontSize: '12px', fontWeight: 600, padding: '5px 14px',
            borderRadius: '99px', marginBottom: '20px', letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>Pricing</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800, color: '#f0f0f0', margin: '0 0 16px 0', lineHeight: 1.1, letterSpacing: '-1px',
          }}>Simple, transparent pricing</h1>
          <p style={{ color: '#555', fontSize: '16px', maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Start free. Upgrade when you need more. No hidden fees.
          </p>
          <div className="toggle-wrap">
            <button className={`toggle-opt${!annual ? ' active' : ''}`} onClick={() => setAnnual(false)}>Monthly</button>
            <button className={`toggle-opt${annual ? ' active' : ''}`} onClick={() => setAnnual(true)}>
              Annual<span className="savings-pill">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-cards cards-grid" style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
          {plans.map((plan) => (
            <div key={plan.name} className={`plan-card${plan.highlight ? ' highlight' : ''}`}>
              {plan.badge && <div className="badge">{plan.badge}</div>}
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: '#f0f0f0', marginBottom: '6px' }}>
                {plan.name}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '40px', fontWeight: 800, color: plan.highlight ? '#00e5a0' : '#f0f0f0', letterSpacing: '-1px' }}>
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                {(annual ? plan.annualPrice : plan.monthlyPrice) > 0 && (
                  <span style={{ color: '#444', fontSize: '14px', marginLeft: '4px' }}>/mo</span>
                )}
                {annual && plan.annualPrice > 0 && (
                  <div style={{ color: '#444', fontSize: '12px', marginTop: '4px' }}>billed annually</div>
                )}
              </div>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.55, marginBottom: '24px', minHeight: '40px' }}>
                {plan.description}
              </p>
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px', marginBottom: '28px', display: 'flex', flexDirection: 'column' }}>
                {plan.features.map((f) => (
                  <div key={f} className="feature-item">
                    <div className="check">
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                className={`plan-btn${plan.highlight ? ' primary' : ' secondary'}`}
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.name}
              >
                {loading === plan.name ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#333', fontSize: '13px', marginTop: '40px' }}>
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </div>
  );
}