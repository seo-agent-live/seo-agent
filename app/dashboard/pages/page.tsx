'use client';
import { useState, useEffect } from 'react';

export default function LandingPagesPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [preview, setPreview] = useState(null);
  const [wpConfig, setWpConfig] = useState({ url: '', username: '', password: '' });
  const [showWpConfig, setShowWpConfig] = useState(false);

  const [form, setForm] = useState({
    product: '',
    benefit: '',
    audience: '',
    cta: '',
    tone: 'professional',
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/landing-pages/list');
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!form.product.trim() || !form.benefit.trim()) return;
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch('/api/landing-pages/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPreview(data);
      setActiveTab('preview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    try {
      const res = await fetch('/api/landing-pages/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.product, content: preview.copy, html: preview.html }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Landing page saved!');
      setTimeout(() => setSuccess(null), 3000);
      fetchPages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([preview.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.product.replace(/\s+/g, '-').toLowerCase()}-landing-page.html`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(preview.copy);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  const handlePublishWordPress = async () => {
    if (!wpConfig.url || !wpConfig.username || !wpConfig.password) {
      setShowWpConfig(true);
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch('/api/publish/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.product, content: preview.html, wpConfig }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Published to WordPress!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Landing Pages
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Generate, edit, and publish high-converting landing pages with AI.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'generate', label: '⚡ Generate' },
          { id: 'preview', label: '👁️ Preview' },
          { id: 'saved', label: '📚 Saved Pages' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid', borderColor: activeTab === tab.id ? '#6366f1' : 'rgba(255,255,255,0.1)', background: activeTab === tab.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: activeTab === tab.id ? '#a5b4fc' : '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '20px' }}>Generate Landing Page</h2>

          {[
            { key: 'product', label: 'Product / Service Name *', placeholder: 'e.g. SEOAgent' },
            { key: 'benefit', label: 'Main Benefit *', placeholder: 'e.g. Rank on Google in 30 days' },
            { key: 'audience', label: 'Target Audience', placeholder: 'e.g. SaaS founders, content marketers' },
            { key: 'cta', label: 'Call to Action', placeholder: 'e.g. Start Free Trial, Get Started' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>{f.label}</label>
              <input
                value={form[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tone</label>
            <select value={form.tone} onChange={e => setForm(prev => ({ ...prev, tone: e.target.value }))} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="professional" style={{ background: '#1a1740' }}>Professional</option>
              <option value="bold" style={{ background: '#1a1740' }}>Bold & Punchy</option>
              <option value="friendly" style={{ background: '#1a1740' }}>Friendly</option>
              <option value="luxury" style={{ background: '#1a1740' }}>Luxury</option>
            </select>
          </div>

          {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

          <button onClick={handleGenerate} disabled={loading || !form.product.trim() || !form.benefit.trim()} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {loading ? '⚡ Generating...' : '⚡ Generate Landing Page'}
          </button>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div>
          {!preview ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>👁️</div>
              <p>Generate a landing page first to see the preview.</p>
            </div>
          ) : (
            <div>
              {/* Action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
                <button onClick={handleSave} style={{ padding: '10px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  💾 Save
                </button>
                <button onClick={handleCopy} style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📋 Copy
                </button>
                <button onClick={handleDownloadHTML} style={{ padding: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', color: '#f59e0b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ⬇️ HTML
                </button>
                <button onClick={handlePublishWordPress} disabled={publishing} style={{ padding: '10px', background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.2)', borderRadius: '8px', color: '#60a5fa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {publishing ? 'Publishing...' : '🌐 WordPress'}
                </button>
              </div>

              {success && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}
              {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

              {/* WordPress Config */}
              {showWpConfig && (
                <div style={{ padding: '20px', background: 'rgba(33,150,243,0.05)', border: '1px solid rgba(33,150,243,0.15)', borderRadius: '14px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#60a5fa', marginBottom: '16px' }}>WordPress Configuration</h3>
                  {[
                    { key: 'url', label: 'WordPress URL', placeholder: 'https://yoursite.com' },
                    { key: 'username', label: 'Username', placeholder: 'admin' },
                    { key: 'password', label: 'Application Password', placeholder: 'xxxx xxxx xxxx xxxx' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '12px' }}>
                      <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                      <input value={wpConfig[f.key]} onChange={e => setWpConfig(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} type={f.key === 'password' ? 'password' : 'text'} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <button onClick={handlePublishWordPress} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Publish Now →</button>
                </div>
              )}

              {/* HTML Preview */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' }}>Live Preview</h3>
                <iframe srcDoc={preview.html} style={{ width: '100%', height: '500px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#fff' }} />
              </div>

              {/* Copy preview */}
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' }}>Copy Text</h3>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.8' }}>{preview.copy}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Pages Tab */}
      {activeTab === 'saved' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Saved Landing Pages</h2>
          {pages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
              <p>No saved pages yet. Generate your first landing page!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {pages.map((page, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>{page.title}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{new Date(page.created_at).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => { setPreview({ html: page.html, copy: page.content }); setActiveTab('preview'); }} style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    View →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}