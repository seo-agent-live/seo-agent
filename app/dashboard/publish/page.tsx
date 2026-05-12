'use client';
import { useState, useEffect } from 'react';

export default function PublishPage() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wpConfig, setWpConfig] = useState({ url: '', username: '', password: '' });
  const [showWpConfig, setShowWpConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/publish/articles');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/publish/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Article saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
      fetchArticles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const text = `# ${title}\n\n${content}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
  };

  const handleDownloadHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head><title>${title}</title></head>
<body>
<h1>${title}</h1>
${content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n')}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
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
        body: JSON.stringify({ title, content, wpConfig }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Published to WordPress successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  const handleLoadArticle = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setSelected(article.id);
    setActiveTab('compose');
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Publish
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Write, save, and publish your articles to WordPress, Webflow, or download them.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[{ id: 'compose', label: '✍️ Compose' }, { id: 'saved', label: '📚 Saved Articles' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid', borderColor: activeTab === tab.id ? '#6366f1' : 'rgba(255,255,255,0.1)', background: activeTab === tab.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: activeTab === tab.id ? '#a5b4fc' : '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'compose' && (
        <div>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Article title...'
              style={{ width: '100%', padding: '14px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '18px', fontWeight: 600, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: '20px' }}>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder='Write or paste your article content here...'
              rows={16}
              style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', lineHeight: '1.8', boxSizing: 'border-box' }}
            />
          </div>

          {/* Error / Success */}
          {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
          {success && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <button onClick={handleSave} disabled={loading || !title.trim() || !content.trim()} style={{ padding: '12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: '#a5b4fc', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Saving...' : '💾 Save Article'}
            </button>
            <button onClick={handleDownloadMarkdown} disabled={!title.trim() || !content.trim()} style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', color: '#10b981', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ⬇️ Download Markdown
            </button>
            <button onClick={handleDownloadHTML} disabled={!title.trim() || !content.trim()} style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', color: '#f59e0b', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ⬇️ Download HTML
            </button>
            <button onClick={handlePublishWordPress} disabled={publishing || !title.trim() || !content.trim()} style={{ padding: '12px', background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.2)', borderRadius: '10px', color: '#60a5fa', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {publishing ? 'Publishing...' : '🌐 Publish to WordPress'}
            </button>
          </div>

          {/* WordPress Config */}
          {showWpConfig && (
            <div style={{ padding: '20px', background: 'rgba(33,150,243,0.05)', border: '1px solid rgba(33,150,243,0.15)', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#60a5fa', marginBottom: '16px' }}>WordPress Configuration</h3>
              {[
                { key: 'url', label: 'WordPress URL', placeholder: 'https://yoursite.com' },
                { key: 'username', label: 'Username', placeholder: 'admin' },
                { key: 'password', label: 'Application Password', placeholder: 'xxxx xxxx xxxx xxxx' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    value={wpConfig[f.key]}
                    onChange={e => setWpConfig(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    type={f.key === 'password' ? 'password' : 'text'}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <button onClick={handlePublishWordPress} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Publish Now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Saved Articles */}
      {activeTab === 'saved' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Saved Articles</h2>
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
              <p>No saved articles yet. Write and save your first article!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {articles.map((article, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>{article.title}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{new Date(article.created_at).toLocaleDateString()} · {article.content?.split(' ').length || 0} words</div>
                  </div>
                  <button onClick={() => handleLoadArticle(article)} style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Edit →
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