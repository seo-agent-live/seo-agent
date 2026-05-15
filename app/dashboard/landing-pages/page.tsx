'use client';
import { useState, useEffect } from 'react';

const TEMPLATES = [
  { id: 'saas',      label: 'SaaS Product',     icon: '🚀', desc: 'Product-led growth landing page with features & pricing' },
  { id: 'agency',    label: 'Agency / Service',  icon: '🏢', desc: 'Professional services page with case studies & CTA' },
  { id: 'lead',      label: 'Lead Capture',      icon: '🎯', desc: 'High-converting lead gen page with form & social proof' },
  { id: 'webinar',   label: 'Webinar / Event',   icon: '🎙️', desc: 'Event registration page with countdown & speakers' },
  { id: 'ebook',     label: 'eBook / Download',  icon: '📖', desc: 'Content offer page with preview & download gate' },
  { id: 'custom',    label: 'Custom',            icon: '✨', desc: 'Describe your own landing page from scratch' },
];

const GOALS = ['Generate leads', 'Drive signups', 'Sell a product', 'Promote an event', 'Grow email list'];
const TONES = ['Professional', 'Friendly', 'Bold & Direct', 'Minimalist', 'Luxury'];

const card = { background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' };
const inp  = { width: '100%', padding: '10px 12px', background: '#0D1117', border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
const lbl  = { fontSize: '11px', fontWeight: '600', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' };

const PAGES_KEY = 'rankflow_landing_pages';

export default function LandingPagesPage() {
  const [pages,       setPages]       = useState([]);
  const [view,        setView]        = useState('list');   // list | create | preview
  const [activePage,  setActivePage]  = useState(null);
  const [notif,       setNotif]       = useState('');

  // form state
  const [template,    setTemplate]    = useState('saas');
  const [productName, setProductName] = useState('');
  const [headline,    setHeadline]    = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [goal,        setGoal]        = useState(GOALS[0]);
  const [tone,        setTone]        = useState(TONES[0]);
  const [keywords,    setKeywords]    = useState('');
  const [ctaText,     setCtaText]     = useState('Get Started Free');
  const [extraNotes,  setExtraNotes]  = useState('');

  const [loading,     setLoading]     = useState(false);
  const [loadingMsg,  setLoadingMsg]  = useState('');
  const [error,       setError]       = useState('');
  const [copied,      setCopied]      = useState(false);

  const loadingMsgs = ['Crafting your headline...', 'Building sections...', 'Writing copy...', 'Optimising for conversions...', 'Adding SEO meta tags...'];

  useEffect(() => {
    try { setPages(JSON.parse(localStorage.getItem(PAGES_KEY) || '[]')); } catch {}
  }, []);

  const toast = (msg) => { setNotif(msg); setTimeout(() => setNotif(''), 3000); };

  const savePages = (updated) => {
    setPages(updated);
    try { localStorage.setItem(PAGES_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleGenerate = async () => {
    if (!productName.trim()) { setError('Please enter a product or business name.'); return; }
    setError('');
    setLoading(true);

    let i = 0;
    setLoadingMsg(loadingMsgs[0]);
    const interval = setInterval(() => { i = (i + 1) % loadingMsgs.length; setLoadingMsg(loadingMsgs[i]); }, 2200);

    try {
      const res = await fetch('/api/landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, productName, headline, subheadline, goal, tone, keywords, ctaText, extraNotes }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const newPage = {
        id: Date.now(),
        productName,
        template,
        goal,
        tone,
        headline: data.headline || headline || productName,
        subheadline: data.subheadline || subheadline,
        ctaText,
        html: data.html,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        sections: data.sections || [],
        createdAt: new Date().toISOString(),
        published: false,
      };

      const updated = [newPage, ...pages];
      savePages(updated);
      setActivePage(newPage);
      setView('preview');
      toast('Landing page generated!');
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    savePages(pages.filter(p => p.id !== id));
    if (activePage?.id === id) { setActivePage(null); setView('list'); }
    toast('Page deleted');
  };

  const handleCopyHTML = async () => {
    if (!activePage?.html) return;
    await navigator.clipboard.writeText(activePage.html);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast('HTML copied to clipboard');
  };

  const handleDownload = () => {
    if (!activePage?.html) return;
    const blob = new Blob([activePage.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePage.productName.replace(/\s+/g, '-').toLowerCase()}-landing.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Downloaded as .html');
  };

  const handleTogglePublish = (id) => {
    const updated = pages.map(p => p.id === id ? { ...p, published: !p.published } : p);
    savePages(updated);
    if (activePage?.id === id) setActivePage(prev => ({ ...prev, published: !prev.published }));
    toast(pages.find(p => p.id === id)?.published ? 'Page unpublished' : 'Page marked as published');
  };

  const resetForm = () => {
    setTemplate('saas'); setProductName(''); setHeadline(''); setSubheadline('');
    setGoal(GOALS[0]); setTone(TONES[0]); setKeywords(''); setCtaText('Get Started Free');
    setExtraNotes(''); setError('');
  };

  // ── SELECT pill ──
  const Pill = ({ value, options, onChange }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
          cursor: 'pointer', fontFamily: 'inherit',
          background: value === o ? 'rgba(79,124,255,0.15)' : '#0D1117',
          border: `1px solid ${value === o ? 'rgba(79,124,255,0.5)' : '#21262D'}`,
          color: value === o ? '#4F7CFF' : '#8B949E',
        }}>{o}</button>
      ))}
    </div>
  );

  return (
    <>
      <style>{`.lp-input::placeholder{color:#30363D}.lp-input:focus{border-color:rgba(79,124,255,0.5)!important;outline:none}`}</style>

      {notif && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', padding: '12px 18px', fontSize: '13px', color: '#E8EDF8', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          ✓ {notif}
        </div>
      )}

      <div style={{ padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: '0 0 6px' }}>
              {view === 'create' ? '← ' : ''}
              {view === 'preview' ? '← ' : ''}
              🖥️ Landing Pages
            </h1>
            <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>
              Generate high-converting, SEO-optimised landing pages with AI.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {view !== 'list' && (
              <button onClick={() => { setView('list'); setActivePage(null); }} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>
                ← Back
              </button>
            )}
            {view === 'list' && (
              <button onClick={() => { resetForm(); setView('create'); }} style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: '#4F7CFF', border: 'none', color: 'white' }}>
                + New Page
              </button>
            )}
          </div>
        </div>

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <>
            {pages.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '80px 40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖥️</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>No landing pages yet</div>
                <div style={{ fontSize: '13px', color: '#8B949E', marginBottom: '24px' }}>Generate your first AI-powered landing page in minutes.</div>
                <button onClick={() => { resetForm(); setView('create'); }} style={{ padding: '10px 24px', background: '#4F7CFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  + Create Landing Page
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {pages.map(p => {
                  const tmpl = TEMPLATES.find(t => t.id === p.template);
                  return (
                    <div key={p.id} style={{ ...card, border: `1px solid ${p.published ? 'rgba(29,184,160,0.25)' : '#21262D'}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '22px' }}>{tmpl?.icon || '🖥️'}</span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>{p.productName}</div>
                            <div style={{ fontSize: '11px', color: '#8B949E' }}>{tmpl?.label} · {new Date(p.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: p.published ? 'rgba(29,184,160,0.12)' : 'rgba(139,148,158,0.12)', color: p.published ? '#1DB8A0' : '#8B949E' }}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#C9D1D9', marginBottom: '4px', fontWeight: '500' }}>{p.headline}</div>
                      <div style={{ fontSize: '11px', color: '#8B949E', marginBottom: '16px', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {p.subheadline}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setActivePage(p); setView('preview'); }} style={{ flex: 1, padding: '8px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)', color: '#4F7CFF' }}>
                          View
                        </button>
                        <button onClick={() => handleTogglePublish(p.id)} style={{ flex: 1, padding: '8px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: p.published ? 'rgba(226,75,74,0.1)' : 'rgba(29,184,160,0.1)', border: `1px solid ${p.published ? 'rgba(226,75,74,0.3)' : 'rgba(29,184,160,0.3)'}`, color: p.published ? '#E24B4A' : '#1DB8A0' }}>
                          {p.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={{ padding: '8px 12px', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── CREATE VIEW ── */}
        {view === 'create' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

            {/* Left: Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Template picker */}
              <div style={card}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>🎨 Page Template</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                      padding: '14px 10px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                      background: template === t.id ? 'rgba(79,124,255,0.12)' : '#0D1117',
                      border: `1px solid ${template === t.id ? 'rgba(79,124,255,0.5)' : '#21262D'}`,
                    }}>
                      <div style={{ fontSize: '22px', marginBottom: '6px' }}>{t.icon}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: template === t.id ? '#4F7CFF' : '#C9D1D9' }}>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core details */}
              <div style={card}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '16px' }}>📝 Page Details</div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>Product / Business Name *</label>
                  <input className="lp-input" value={productName} onChange={e => setProductName(e.target.value)} placeholder='e.g. "RankFlow"' style={inp} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>Headline (leave blank to auto-generate)</label>
                  <input className="lp-input" value={headline} onChange={e => setHeadline(e.target.value)} placeholder='e.g. "Rank #1 on Google — Without the Guesswork"' style={inp} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>Subheadline (optional)</label>
                  <input className="lp-input" value={subheadline} onChange={e => setSubheadline(e.target.value)} placeholder='Supporting description under the headline' style={inp} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>CTA Button Text</label>
                  <input className="lp-input" value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder='e.g. "Get Started Free"' style={inp} />
                </div>

                <div>
                  <label style={lbl}>Target Keywords (for SEO)</label>
                  <input className="lp-input" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder='e.g. "seo tool, rank on google, ai content"' style={inp} />
                </div>
              </div>

              {/* Goal & Tone */}
              <div style={card}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>🎯 Goal</div>
                <Pill value={goal} options={GOALS} onChange={setGoal} />
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', margin: '16px 0 10px' }}>🎨 Tone</div>
                <Pill value={tone} options={TONES} onChange={setTone} />
              </div>

              {/* Extra instructions */}
              <div style={card}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '10px' }}>💬 Extra Instructions</div>
                <textarea
                  className="lp-input"
                  value={extraNotes}
                  onChange={e => setExtraNotes(e.target.value)}
                  placeholder='e.g. "Include a pricing section", "Add testimonials from SaaS founders", "Target early-stage startups"'
                  rows={3}
                  style={{ ...inp, resize: 'vertical', lineHeight: '1.5' }}
                />
              </div>

              {error && <div style={{ padding: '12px 16px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '8px', fontSize: '13px', color: '#E24B4A' }}>⚠️ {error}</div>}

              <button onClick={handleGenerate} disabled={loading || !productName.trim()} style={{
                width: '100%', padding: '14px', background: loading || !productName.trim() ? 'rgba(79,124,255,0.3)' : '#4F7CFF',
                border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700',
                cursor: loading || !productName.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}>
                {loading ? `⏳ ${loadingMsg}` : '✨ Generate Landing Page'}
              </button>
            </div>

            {/* Right: Tips sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={card}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>💡 Tips for Best Results</div>
                {[
                  { icon: '🎯', tip: 'Be specific with your product name and what problem it solves.' },
                  { icon: '🔑', tip: 'Add 3–5 target keywords to help the AI write SEO-friendly copy.' },
                  { icon: '📣', tip: 'A clear CTA button text increases conversions (e.g. "Start Free Trial").' },
                  { icon: '✍️', tip: 'Use Extra Instructions to request specific sections like pricing or FAQs.' },
                  { icon: '🎨', tip: 'Choose a tone that matches your brand — Bold works great for SaaS.' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < 4 ? '1px solid #21262D' : 'none' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{t.icon}</span>
                    <span style={{ fontSize: '12px', color: '#8B949E', lineHeight: '1.6' }}>{t.tip}</span>
                  </div>
                ))}
              </div>

              <div style={card}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '10px' }}>📊 What Gets Generated</div>
                {['Full HTML page ready to deploy', 'SEO meta title & description', 'Hero, features, social proof sections', 'Optimised headline & subheadline', 'CTA sections throughout the page'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', padding: '7px 0', borderBottom: i < 4 ? '1px solid #21262D' : 'none' }}>
                    <span style={{ color: '#1DB8A0', fontSize: '12px' }}>✓</span>
                    <span style={{ fontSize: '12px', color: '#C9D1D9' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW VIEW ── */}
        {view === 'preview' && activePage && (
          <div>
            {/* Action bar */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '2px' }}>{activePage.productName}</div>
                <div style={{ fontSize: '12px', color: '#8B949E' }}>
                  {TEMPLATES.find(t => t.id === activePage.template)?.label} · {activePage.goal} · {new Date(activePage.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={handleCopyHTML} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: copied ? 'rgba(29,184,160,0.12)' : 'transparent', border: `1px solid ${copied ? '#1DB8A0' : '#21262D'}`, color: copied ? '#1DB8A0' : '#8B949E' }}>
                  {copied ? '✓ Copied' : '📋 Copy HTML'}
                </button>
                <button onClick={handleDownload} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>
                  ⬇️ Download
                </button>
                <button onClick={() => handleTogglePublish(activePage.id)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: activePage.published ? 'rgba(226,75,74,0.1)' : 'rgba(29,184,160,0.1)', border: `1px solid ${activePage.published ? 'rgba(226,75,74,0.3)' : 'rgba(29,184,160,0.3)'}`, color: activePage.published ? '#E24B4A' : '#1DB8A0' }}>
                  {activePage.published ? 'Unpublish' : '🚀 Publish'}
                </button>
                <button onClick={() => { resetForm(); setView('create'); }} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: '#4F7CFF', border: 'none', color: 'white' }}>
                  + New Page
                </button>
              </div>
            </div>

            {/* Meta info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={card}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#4F7CFF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>Meta Title</div>
                <div style={{ fontSize: '13px', color: '#E8EDF8' }}>{activePage.metaTitle || activePage.productName}</div>
                <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '4px' }}>{(activePage.metaTitle || activePage.productName).length} chars</div>
              </div>
              <div style={card}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#1DB8A0', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>Meta Description</div>
                <div style={{ fontSize: '13px', color: '#C9D1D9', lineHeight: '1.5' }}>{activePage.metaDescription || '—'}</div>
                <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '4px' }}>{(activePage.metaDescription || '').length} chars</div>
              </div>
            </div>

            {/* HTML preview */}
            {activePage.html ? (
              <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #21262D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['#E24B4A', '#F59E0B', '#1DB8A0'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
                  </div>
                  <span style={{ fontSize: '12px', color: '#8B949E', marginLeft: '8px' }}>Live Preview</span>
                </div>
                <iframe
                  srcDoc={activePage.html}
                  style={{ width: '100%', height: '600px', border: 'none', display: 'block' }}
                  title="Landing Page Preview"
                />
              </div>
            ) : (
              <div style={{ ...card, padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>Generated Sections</div>
                {activePage.sections?.length > 0 ? activePage.sections.map((section, i) => (
                  <div key={i} style={{ padding: '14px', background: '#0D1117', border: '1px solid #21262D', borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#4F7CFF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>{section.name}</div>
                    <div style={{ fontSize: '13px', color: '#C9D1D9', lineHeight: '1.6' }}>{section.content}</div>
                  </div>
                )) : (
                  <div style={{ fontSize: '13px', color: '#8B949E' }}>No preview available. Download the HTML file to view the full page.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}