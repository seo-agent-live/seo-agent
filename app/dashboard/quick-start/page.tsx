'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'rankflow_quickstart_progress';

const steps = [
  {
    num: 1,
    icon: '✍️',
    title: 'Generate your first article',
    desc: 'Enter a keyword and let AI write a full SEO-optimised article for you. Our AI analyses top-ranking content and produces long-form articles designed to rank.',
    cta: 'Go to AI Writer',
    href: '/dashboard/writer',
    color: '#4F7CFF',
    bg: 'rgba(79,124,255,0.1)',
    border: 'rgba(79,124,255,0.3)',
    tips: [
      'Use long-tail keywords for faster rankings',
      'Target keywords with 1,000–10,000 monthly searches',
      'Include your target keyword in the article title',
    ],
  },
  {
    num: 2,
    icon: '🔍',
    title: 'Track your keywords',
    desc: 'Add the keywords you want to rank for and monitor your positions daily. Get notified when your rankings change and spot opportunities before competitors do.',
    cta: 'Go to Keyword Tracker',
    href: '/dashboard/keywords',
    color: '#1DB8A0',
    bg: 'rgba(29,184,160,0.1)',
    border: 'rgba(29,184,160,0.3)',
    tips: [
      'Track at least 10 keywords to start',
      'Mix branded and non-branded keywords',
      'Check rankings weekly for best insights',
    ],
  },
  {
    num: 3,
    icon: '📊',
    title: 'Analyse your competitors',
    desc: 'See what your top competitors are ranking for and find content gaps in your niche. Discover which keywords are driving their traffic and outrank them.',
    cta: 'Go to Competitors',
    href: '/dashboard/competitors',
    color: '#D35486',
    bg: 'rgba(211,84,134,0.1)',
    border: 'rgba(211,84,134,0.3)',
    tips: [
      'Add 3–5 direct competitors to start',
      "Focus on gaps where competitors rank but you don't",
      'Target competitor keywords with lower difficulty',
    ],
  },
  {
    num: 4,
    icon: '🌐',
    title: 'Run a site audit',
    desc: 'Scan your website for technical SEO issues and fix them fast. Broken links, missing meta tags, slow pages — find and fix everything holding back your rankings.',
    cta: 'Go to Site Audit',
    href: '/dashboard/site-audit',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    tips: [
      'Fix critical errors before minor warnings',
      'Re-run the audit after making fixes',
      'Aim for a site health score above 80',
    ],
  },
  {
    num: 5,
    icon: '🔗',
    title: 'Connect your tools',
    desc: 'Integrate Google Search Console and Analytics for real performance data directly inside RankFlow. See impressions, clicks, and average positions in one place.',
    cta: 'Go to Integrations',
    href: '/dashboard/integrations',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.3)',
    tips: [
      'Google Search Console gives you real ranking data',
      'Connect Analytics to track organic traffic',
      'Data syncs automatically every 24 hours',
    ],
  },
];

const resources = [
  { icon: '📖', title: "SEO Beginner's Guide", desc: 'Learn the fundamentals of SEO in under 30 minutes.', tag: 'Guide' },
  { icon: '🎯', title: 'Keyword Research 101', desc: 'How to find keywords that actually drive traffic.', tag: 'Tutorial' },
  { icon: '⚡', title: 'Technical SEO Checklist', desc: '47 technical SEO checks to run on every site.', tag: 'Checklist' },
  { icon: '📈', title: 'Content Strategy Template', desc: 'Build a 90-day content plan that ranks.', tag: 'Template' },
];

export default function QuickStartPage() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [celebrating, setCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompleted(parsed.completed || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed }));
    } catch {}
  }, [completed, mounted]);

  const toggleComplete = (num: number) => {
    setCompleted(prev => {
      const next = prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num];
      if (next.length === steps.length) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 4000);
      }
      return next;
    });
  };

  const resetProgress = () => {
    setCompleted([]);
    setExpanded(0);
  };

  const progress = Math.round((completed.length / steps.length) * 100);
  const allDone = completed.length === steps.length;

  return (
    <div style={{ padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: 0, marginBottom: '6px' }}>
            🚀 Quick Start Guide
          </h1>
          <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>
            Complete these steps to get the most out of RankFlow. Your progress is saved automatically.
          </p>
        </div>
        <button
          onClick={resetProgress}
          style={{
            fontSize: '12px', padding: '7px 14px', borderRadius: '8px',
            border: '1px solid #21262D', background: 'transparent',
            color: '#8B949E', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Reset Progress
        </button>
      </div>

      {/* Celebration Banner */}
      {(allDone || celebrating) && (
        <div style={{
          background: 'linear-gradient(135deg, #1DB8A0, #4F7CFF)',
          borderRadius: '12px', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              🎉 You've completed the Quick Start!
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              You're all set up. Head to your dashboard to see your progress.
            </div>
          </div>
          <a href="/dashboard" style={{
            padding: '9px 18px', background: 'white', borderRadius: '8px',
            fontSize: '13px', fontWeight: '700', color: '#4F7CFF',
            textDecoration: 'none', flexShrink: 0, marginLeft: '16px',
          }}>
            Go to Dashboard →
          </a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

        {/* Left: Steps */}
        <div>

          {/* Progress Bar */}
          <div style={{
            background: '#161B22', border: '1px solid #21262D',
            borderRadius: '12px', padding: '20px', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>Your Progress</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4F7CFF' }}>
                {completed.length} / {steps.length} completed
              </span>
            </div>
            <div style={{ background: '#21262D', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                background: allDone ? '#1DB8A0' : '#4F7CFF',
                width: `${progress}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: '12px', color: '#8B949E', marginTop: '8px' }}>
              {progress === 0 && 'Get started by completing your first step below.'}
              {progress > 0 && progress < 100 && `${100 - progress}% left — you're doing great!`}
              {progress === 100 && "✅ All steps complete — you're a RankFlow pro!"}
            </div>
          </div>

          {/* Step Cards */}
          {steps.map((step, i) => {
            const isDone = completed.includes(step.num);
            const isOpen = expanded === i;

            return (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>

                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                  <button
                    onClick={() => toggleComplete(step.num)}
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      background: isDone ? step.color : step.bg,
                      border: `2px solid ${isDone ? step.color : step.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isDone ? '15px' : '13px', fontWeight: '700',
                      color: isDone ? 'white' : step.color,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {isDone ? '✓' : step.num}
                  </button>
                  {i < steps.length - 1 && (
                    <div style={{
                      width: '2px', flex: 1, minHeight: '20px',
                      background: isDone ? step.color : '#21262D',
                      margin: '6px 0', transition: 'background 0.3s',
                    }} />
                  )}
                </div>

                {/* Card */}
                <div style={{
                  background: '#161B22',
                  border: `1px solid ${isOpen ? step.border : '#21262D'}`,
                  borderRadius: '12px', flex: 1, overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  opacity: isDone ? 0.75 : 1,
                }}>
                  {/* Card header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    style={{
                      width: '100%', padding: '18px 20px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: step.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                    }}>
                      {step.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px', fontWeight: '600',
                        color: isDone ? '#8B949E' : '#E8EDF8',
                        textDecoration: isDone ? 'line-through' : 'none',
                        marginBottom: '2px',
                      }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8B949E' }}>
                        {isDone ? 'Completed ✓' : isOpen ? 'Click to collapse' : 'Click to expand'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '11px', color: '#8B949E', flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      ▼
                    </div>
                  </button>

                  {/* Expanded body */}
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px' }}>
                      <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.7', margin: '0 0 16px' }}>
                        {step.desc}
                      </p>

                      {/* Pro Tips */}
                      <div style={{
                        background: '#0D1117', border: '1px solid #21262D',
                        borderRadius: '8px', padding: '14px', marginBottom: '16px',
                      }}>
                        <div style={{
                          fontSize: '11px', fontWeight: '700', color: step.color,
                          textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px',
                        }}>
                          💡 Pro Tips
                        </div>
                        {step.tips.map((tip, ti) => (
                          <div key={ti} style={{
                            display: 'flex', gap: '8px',
                            marginBottom: ti < step.tips.length - 1 ? '8px' : 0,
                          }}>
                            <span style={{ color: step.color, flexShrink: 0 }}>→</span>
                            <span style={{ fontSize: '12px', color: '#C9D1D9', lineHeight: '1.5' }}>{tip}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a
                          href={step.href}
                          style={{
                            display: 'inline-block', padding: '9px 18px',
                            background: step.bg, border: `1px solid ${step.border}`,
                            borderRadius: '8px', color: step.color,
                            fontSize: '13px', fontWeight: '600', textDecoration: 'none',
                          }}
                        >
                          {step.cta} →
                        </a>
                        <button
                          onClick={() => toggleComplete(step.num)}
                          style={{
                            padding: '9px 18px', borderRadius: '8px', fontSize: '13px',
                            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                            background: isDone ? 'rgba(29,184,160,0.1)' : 'transparent',
                            border: `1px solid ${isDone ? '#1DB8A0' : '#21262D'}`,
                            color: isDone ? '#1DB8A0' : '#8B949E',
                            transition: 'all 0.2s',
                          }}
                        >
                          {isDone ? '✓ Completed' : 'Mark as Complete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Setup Summary */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '16px' }}>Setup Summary</div>
            {steps.map(step => {
              const isDone = completed.includes(step.num);
              return (
                <div key={step.num} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0',
                  borderBottom: step.num < steps.length ? '1px solid #21262D' : 'none',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: isDone ? '#1DB8A0' : '#21262D',
                    transition: 'background 0.3s',
                  }} />
                  <span style={{
                    fontSize: '12px', flex: 1,
                    color: isDone ? '#C9D1D9' : '#8B949E',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>
                    {step.title}
                  </span>
                  {isDone && <span style={{ fontSize: '11px', color: '#1DB8A0' }}>✓</span>}
                </div>
              );
            })}
          </div>

          {/* Learning Resources */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '16px' }}>📚 Learning Resources</div>
            {resources.map((r, i) => (
              <div key={i} style={{
                display: 'flex', gap: '10px', padding: '10px 0', cursor: 'pointer',
                borderBottom: i < resources.length - 1 ? '1px solid #21262D' : 'none',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', background: '#0D1117',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', flexShrink: 0,
                }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#E8EDF8', marginBottom: '2px' }}>{r.title}</div>
                  <div style={{ fontSize: '11px', color: '#8B949E', lineHeight: '1.5' }}>{r.desc}</div>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: '600', padding: '2px 7px', borderRadius: '6px',
                  background: 'rgba(79,124,255,0.1)', color: '#4F7CFF',
                  flexShrink: 0, alignSelf: 'flex-start',
                }}>
                  {r.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Need Help */}
          <div style={{
            background: '#161B22', border: '1px solid #21262D',
            borderRadius: '12px', padding: '20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>💬</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '6px' }}>Need help?</div>
            <div style={{ fontSize: '12px', color: '#8B949E', marginBottom: '14px', lineHeight: '1.6' }}>
              Our support team is available 24/7 to help you get set up.
            </div>
            <a href="mailto:support@rankflow.io" style={{
              display: 'block', padding: '9px',
              background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)',
              borderRadius: '8px', fontSize: '12px', fontWeight: '600',
              color: '#4F7CFF', textDecoration: 'none',
            }}>
              Contact Support →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}