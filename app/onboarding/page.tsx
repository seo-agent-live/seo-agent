'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 'niche',
    question: "What's your content niche?",
    subtitle: "We'll tailor your SEO strategy around this.",
    options: [
      { value: 'ecommerce', label: '🛍️ eCommerce', desc: 'Product pages, category content' },
      { value: 'saas', label: '⚙️ SaaS / Tech', desc: 'Software, tools, B2B' },
      { value: 'blog', label: '✍️ Blog / Media', desc: 'Editorial, news, personal brand' },
      { value: 'agency', label: '🏢 Agency', desc: 'Managing clients & campaigns' },
      { value: 'local', label: '📍 Local Business', desc: 'Location-based SEO' },
      { value: 'other', label: '🌐 Other', desc: 'Something else entirely' },
    ],
  },
  {
    id: 'goal',
    question: "What's your primary goal?",
    subtitle: 'Focus your efforts where they matter most.',
    options: [
      { value: 'traffic', label: '📈 Drive organic traffic', desc: 'More visitors from Google' },
      { value: 'leads', label: '🎯 Generate leads', desc: 'Turn searchers into customers' },
      { value: 'rankings', label: '🏆 Rank for keywords', desc: 'Climb to page one' },
      { value: 'content', label: '📝 Scale content output', desc: 'Publish faster, more consistently' },
    ],
  },
  {
    id: 'frequency',
    question: 'How often do you publish?',
    subtitle: "We'll set your defaults accordingly.",
    options: [
      { value: 'daily', label: '🔥 Daily', desc: 'High-volume content machine' },
      { value: 'weekly', label: '📅 A few times a week', desc: 'Consistent cadence' },
      { value: 'monthly', label: '🗓️ A few times a month', desc: 'Quality over quantity' },
      { value: 'rarely', label: '🌱 Just starting out', desc: 'Building the habit' },
    ],
  },
  {
    id: 'team',
    question: "Who's using SEOAgent?",
    subtitle: "So we can set up the right experience.",
    options: [
      { value: 'solo', label: '🧑 Just me', desc: 'Solo creator or founder' },
      { value: 'small', label: '👥 Small team (2–5)', desc: 'Startup or small crew' },
      { value: 'medium', label: '🏗️ Medium team (6–20)', desc: 'Growing operation' },
      { value: 'agency', label: '🏢 Agency / Enterprise', desc: '20+ users or client accounts' },
    ],
  },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progressWidth = `${((currentStep + 1) / steps.length) * 100}%`;

  async function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [step.id]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      setSaving(true);
      try {
        await user?.update({
          unsafeMetadata: {
            onboarding: newAnswers,
            onboardingComplete: true,
          },
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = '/dashboard';
      } catch (e) {
        console.error('Failed to save onboarding:', e);
        setSaving(false);
      }
    } else {
      setCurrentStep((s) => s + 1);
      setSelected(null);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1245 0%, #0f0c2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=Syne:wght@700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .onb-wrap {
          animation: fadeUp 0.35s ease both;
        }
        .option-card {
          background: rgba(99, 82, 199, 0.15);
          border: 1.5px solid rgba(99, 82, 199, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          width: 100%;
        }
        .option-card:hover {
          border-color: #3a3a3a;
          background: #161616;
          transform: translateY(-1px);
        }
        .option-card.selected {
          border-color: #00e5a0;
          background: #071a11;
        }
        .next-btn {
          background: #00e5a0;
          color: #0a0a0a;
          border: none;
          border-radius: 10px;
          padding: 14px 32px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.12s;
          width: 100%;
          margin-top: 12px;
        }
        .next-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
          transform: none;
        }
        .next-btn:not(:disabled):hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
        .skip-btn {
          background: none;
          border: none;
          color: #333;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .skip-btn:hover {
          color: #555;
        }
      `}</style>

      <div className="onb-wrap" style={{ width: '100%', maxWidth: '500px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '22px',
            fontWeight: 800,
            color: '#00e5a0',
            letterSpacing: '-0.5px',
            marginBottom: '6px',
          }}>
            SEOAgent
          </div>
          <div style={{ color: '#444', fontSize: '13px' }}>
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '3px',
          background: '#1c1c1c',
          borderRadius: '99px',
          marginBottom: '36px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: progressWidth,
            background: '#00e5a0',
            borderRadius: '99px',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Question */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '26px',
            fontWeight: 800,
            color: '#f0f0f0',
            margin: '0 0 8px 0',
            lineHeight: 1.2,
          }}>
            {step.question}
          </h1>
          <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
            {step.subtitle}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
          {step.options.map((opt) => {
            const emoji = opt.label.split(' ')[0];
            const label = opt.label.split(' ').slice(1).join(' ');
            return (
              <button
                key={opt.value}
                className={`option-card${selected === opt.value ? ' selected' : ''}`}
                onClick={() => setSelected(opt.value)}
              >
                <span style={{ fontSize: '22px', lineHeight: 1, minWidth: '28px' }}>{emoji}</span>
                <div>
                  <div style={{
                    color: selected === opt.value ? '#00e5a0' : '#d0d0d0',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'color 0.15s',
                  }}>
                    {label}
                  </div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!selected || saving}
        >
          {saving ? 'Saving...' : isLast ? '🚀 Go to Dashboard' : 'Continue →'}
        </button>

        {/* Skip */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button className="skip-btn" onClick={() => router.push('/dashboard')}>
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
}