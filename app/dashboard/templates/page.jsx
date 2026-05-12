'use client';
import { useState } from 'react';

const templates = [
  {
    id: 'blog-post',
    icon: '✍️',
    category: 'Blog',
    title: 'Blog Post',
    desc: 'Full SEO-optimized blog post with intro, body, and conclusion.',
    color: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
    fields: [
      { id: 'keyword', label: 'Target Keyword', placeholder: 'e.g. best SEO tools' },
      { id: 'audience', label: 'Target Audience', placeholder: 'e.g. small business owners' },
    ],
    prompt: (f) => `Write a full SEO-optimized blog post targeting the keyword "${f.keyword}" for an audience of ${f.audience}. Include H1, H2s, intro, body sections, and conclusion.`,
  },
  {
    id: 'product-page',
    icon: '🛍️',
    category: 'eCommerce',
    title: 'Product Page',
    desc: 'Compelling product description optimized for conversions and SEO.',
    color: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.3)',
    fields: [
      { id: 'product', label: 'Product Name', placeholder: 'e.g. Wireless Noise Cancelling Headphones' },
      { id: 'features', label: 'Key Features', placeholder: 'e.g. 30hr battery, ANC, foldable' },
    ],
    prompt: (f) => `Write an SEO-optimized product page description for "${f.product}". Key features: ${f.features}. Include a compelling headline, benefits-focused description, and bullet points.`,
  },
  {
    id: 'landing-page',
    icon: '🚀',
    category: 'Marketing',
    title: 'Landing Page Copy',
    desc: 'High-converting landing page copy with headline, benefits, and CTA.',
    color: 'rgba(236,72,153,0.15)',
    border: 'rgba(236,72,153,0.3)',
    fields: [
      { id: 'product', label: 'Product/Service', placeholder: 'e.g. SEO automation tool' },
      { id: 'benefit', label: 'Main Benefit', placeholder: 'e.g. rank on Google in 30 days' },
    ],
    prompt: (f) => `Write high-converting landing page copy for "${f.product}". Main benefit: ${f.benefit}. Include: hero headline, subheadline, 3 key benefits, social proof section, and strong CTA.`,
  },
  {
    id: 'meta-description',
    icon: '🔍',
    category: 'SEO',
    title: 'Meta Description',
    desc: 'Click-worthy meta descriptions under 160 characters.',
    color: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.3)',
    fields: [
      { id: 'page', label: 'Page Topic', placeholder: 'e.g. guide to keyword research' },
      { id: 'keyword', label: 'Target Keyword', placeholder: 'e.g. keyword research' },
    ],
    prompt: (f) => `Write 5 compelling meta descriptions for a page about "${f.page}" targeting the keyword "${f.keyword}". Each must be under 160 characters and include a call to action.`,
  },
  {
    id: 'social-media',
    icon: '📱',
    category: 'Social',
    title: 'Social Media Post',
    desc: 'Engaging social media posts for Twitter, LinkedIn, and Instagram.',
    color: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.3)',
    fields: [
      { id: 'topic', label: 'Topic', placeholder: 'e.g. new blog post about SEO tips' },
      { id: 'platform', label: 'Platform', placeholder: 'e.g. Twitter, LinkedIn, Instagram' },
    ],
    prompt: (f) => `Write 3 engaging social media posts for ${f.platform} about "${f.topic}". Include relevant hashtags and a call to action for each.`,
  },
  {
    id: 'email',
    icon: '📧',
    category: 'Email',
    title: 'Email Newsletter',
    desc: 'Engaging email newsletter with subject line and body copy.',
    color: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.3)',
    fields: [
      { id: 'topic', label: 'Email Topic', placeholder: 'e.g. monthly SEO tips roundup' },
      { id: 'audience', label: 'Audience', placeholder: 'e.g. marketing professionals' },
    ],
    prompt: (f) => `Write an engaging email newsletter about "${f.topic}" for ${f.audience}. Include: 3 subject line options, preheader text, intro, main content sections, and CTA.`,
  },
];

export default function TemplatesPage() {
  const [selected, setSelected] = useState(null);
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter);

  const handleSelect = (template) => {
    setSelected(template);
    setFields({});
    setResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: selected.prompt(fields) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Content Templates
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Choose a template and generate content in seconds.
      </p>

      {!selected ? (
        <div>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid', borderColor: filter === cat ? '#6366f1' : 'rgba(255,255,255,0.1)', background: filter === cat ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: filter === cat ? '#a5b4fc' : '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {filtered.map(t => (
              <div key={t.id} onClick={() => handleSelect(t)} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.border}`, borderRadius: '14px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>{t.icon}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{t.category}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>{t.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Back button */}
          <button onClick={() => { setSelected(null); setResult(null); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '24px' }}>
            ← Back to Templates
          </button>

          {/* Template Form */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{selected.icon}</div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{selected.title}</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{selected.desc}</p>
              </div>
            </div>

            {selected.fields.map(field => (
              <div key={field.id} style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>{field.label}</label>
                <input
                  value={fields[field.id] || ''}
                  onChange={e => setFields(prev => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <button onClick={handleGenerate} disabled={loading || selected.fields.some(f => !fields[f.id]?.trim())} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⚡ Generating...' : '⚡ Generate Content'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '14px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Generated Content</h2>
                <button onClick={handleCopy} style={{ padding: '8px 16px', background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', border: '1px solid', borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.4)', borderRadius: '8px', color: copied ? '#10b981' : '#a5b4fc', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#cbd5e1', margin: 0, lineHeight: '1.8' }}>
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}