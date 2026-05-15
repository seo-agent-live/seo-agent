'use client';
import { useState, useEffect } from 'react';

const PLATFORMS = [
  { id: 'wordpress', label: 'WordPress', icon: '🌐', color: '#4F7CFF', desc: 'Publish directly to your WordPress site via REST API' },
  { id: 'webflow', label: 'Webflow', icon: '🔷', color: '#1DB8A0', desc: 'Push articles to your Webflow CMS collection' },
  { id: 'ghost', label: 'Ghost', icon: '👻', color: '#A78BFA', desc: 'Publish to your Ghost blog via Admin API' },
  { id: 'medium', label: 'Medium', icon: '📝', color: '#F59E0B', desc: 'Cross-post articles to your Medium publication' },
  { id: 'copy', label: 'Copy HTML', icon: '📋', color: '#8B949E', desc: 'Copy the article as formatted HTML to clipboard' },
  { id: 'download', label: 'Download', icon: '⬇️', color: '#E24B4A', desc: 'Download as .html or .md file' },
];

const STATUS_COLORS = {
  published: { bg: 'rgba(29,184,160,0.12)', color: '#1DB8A0', label: 'Published' },
  draft: { bg: 'rgba(79,124,255,0.12)', color: '#4F7CFF', label: 'Draft' },
  scheduled: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Scheduled' },
  failed: { bg: 'rgba(226,75,74,0.12)', color: '#E24B4A', label: 'Failed' },
};

const ARTICLES_KEY = 'rankflow_articles';
const PUBLISH_LOG_KEY = 'rankflow_publish_log';
const CONNECTIONS_KEY = 'rankflow_connections';

function ArticleCard({ article, selected, onSelect }) {
  const sc = STATUS_COLORS[article.publishStatus || 'draft'];
  return (
    <div
      onClick={() => onSelect(article)}
      style={{
        padding: '16px', background: selected ? '#1C2128' : '#161B22',
        border: `1px solid ${selected ? '#4F7CFF' : '#21262D'}`,
        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {article.keyword || article.title || 'Untitled Article'}
          </div>
          <div style={{ fontSize: '11px', color: '#8B949E' }}>
            {article.wordCount || 0} words · {article.date || 'Today'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: sc.bg, color: sc.color }}>
            {sc.label}
          </span>
          {selected && <span style={{ fontSize: '10px', color: '#4F7CFF' }}>✓ Selected</span>}
        </div>
      </div>
    </div>
  );
}

function ConnectionModal({ platform, onClose, onConnect }) {
  const [fields, setFields] = useState({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const platformFields = {
    wordpress: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://yoursite.com', type: 'text' },
      { key: 'username', label: 'Username', placeholder: 'admin', type: 'text' },
      { key: 'appPassword', label: 'Application Password', placeholder: 'xxxx xxxx xxxx xxxx', type: 'password' },
    ],
    webflow: [
      { key: 'apiToken', label: 'API Token', placeholder: 'Your Webflow API token', type: 'password' },
      { key: 'collectionId', label: 'Collection ID', placeholder: 'Collection ID from Webflow', type: 'text' },
    ],
    ghost: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://yourblog.ghost.io', type: 'text' },
      { key: 'adminApiKey', label: 'Admin API Key', placeholder: 'id:secret format', type: 'password' },
    ],
    medium: [
      { key: 'integrationToken', label: 'Integration Token', placeholder: 'Your Medium integration token', type: 'password' },
    ],
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 1500));
    const allFilled = (platformFields[platform.id] || []).every(f => fields[f.key]?.trim());
    setTestResult(allFilled ? 'success' : 'error');
    setTesting(false);
  };

  const handleConnect = () => {
    const allFilled = (platformFields[platform.id] || []).every(f => fields[f.key]?.trim());
    if (!allFilled) { setTestResult('error'); return; }
    onConnect(platform.id, fields);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#0D1117',
    border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>
              Connect {platform.label}
            </div>
            <div style={{ fontSize: '12px', color: '#8B949E' }}>{platform.desc}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8B949E', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {(platformFields[platform.id] || []).map(field => (
          <div key={field.key} style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={fields[field.key] || ''}
              onChange={e => setFields(f => ({ ...f, [field.key]: e.target.value }))}
              style={inputStyle as React.CSSProperties}
            />
          </div>
        ))}

        {testResult === 'success' && (
          <div style={{ padding: '10px 14px', background: 'rgba(29,184,160,0.1)', border: '1px solid rgba(29,184,160,0.3)', borderRadius: '8px', fontSize: '12px', color: '#1DB8A0', marginBottom: '14px' }}>
            ✓ Connection successful! Ready to publish.
          </div>
        )}
        {testResult === 'error' && (
          <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '8px', fontSize: '12px', color: '#E24B4A', marginBottom: '14px' }}>
            ✗ Connection failed. Please check your credentials and try again.
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button onClick={handleTest} disabled={testing} style={{
            flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
            cursor: testing ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            background: 'transparent', border: '1px solid #21262D', color: '#8B949E',
          }}>
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button onClick={handleConnect} style={{
            flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit', background: '#4F7CFF', border: 'none', color: 'white',
          }}>
            Connect & Save
          </button>
        </div>
      </div>
    </div>
  );
}

function PublishModal({ article, platform, connection, onClose, onPublished }) {
  const [status, setStatus] = useState('idle'); // idle | publishing | success | error
  const [publishAs, setPublishAs] = useState('published');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [customSlug, setCustomSlug] = useState(
    (article?.keyword || article?.title || 'article').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  );
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePublish = async () => {
    setStatus('publishing');
    setErrorMsg('');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform.id,
          connection,
          article: {
            title: article.keyword || article.title,
            content: article.content,
            metaDescription: article.metaDescription,
            slug: customSlug,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            category,
            status: publishAs,
            scheduledAt: publishAs === 'scheduled' ? `${scheduledDate}T${scheduledTime}` : null,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStatus('success');
      onPublished({ platform: platform.id, url: data.url, publishedAt: new Date().toISOString() });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Publish failed. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: '#0D1117',
    border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '600', color: '#8B949E',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#E8EDF8', marginBottom: '8px' }}>Published Successfully!</div>
            <div style={{ fontSize: '13px', color: '#8B949E', marginBottom: '24px' }}>
              Your article is now live on {platform.label}.
            </div>
            <button onClick={onClose} style={{ padding: '10px 24px', background: '#4F7CFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>
                  Publish to {platform.label}
                </div>
                <div style={{ fontSize: '12px', color: '#8B949E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                  {article?.keyword || article?.title || 'Untitled'}
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8B949E', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Publish Status */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Publish As</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {['published', 'draft', 'scheduled'].map(s => (
                  <button key={s} onClick={() => setPublishAs(s)} style={{
                    padding: '9px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                    background: publishAs === s ? STATUS_COLORS[s].bg : '#0D1117',
                    border: `1px solid ${publishAs === s ? STATUS_COLORS[s].color : '#21262D'}`,
                    color: publishAs === s ? STATUS_COLORS[s].color : '#8B949E',
                    fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled date/time */}
            {publishAs === 'scheduled' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time</label>
                  <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} style={inputStyle} />
                </div>
              </div>
            )}

            {/* Slug */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>URL Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#0D1117', border: '1px solid #21262D', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '10px 12px', fontSize: '12px', color: '#8B949E', borderRight: '1px solid #21262D', whiteSpace: 'nowrap' }}>/blog/</span>
                <input
                  value={customSlug}
                  onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                  style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1 }}
                />
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="seo, content marketing, digital marketing" style={inputStyle} />
            </div>

            {/* Category (WordPress only) */}
            {platform.id === 'wordpress' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. SEO Tips" style={inputStyle} />
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '8px', fontSize: '12px', color: '#E24B4A', marginBottom: '16px' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} style={{
                flex: 1, padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E',
              }}>Cancel</button>
              <button onClick={handlePublish} disabled={status === 'publishing'} style={{
                flex: 2, padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: '700',
                cursor: status === 'publishing' ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                background: status === 'publishing' ? 'rgba(79,124,255,0.4)' : '#4F7CFF', border: 'none', color: 'white',
              }}>
                {status === 'publishing' ? '⏳ Publishing...' : publishAs === 'scheduled' ? '📅 Schedule Post' : '🚀 Publish Now'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PublishPage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [connections, setConnections] = useState({});
  const [publishLog, setPublishLog] = useState([]);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [publishingPlatform, setPublishingPlatform] = useState(null);
  const [notification, setNotification] = useState('');
  const [activeTab, setActiveTab] = useState('publish'); // publish | log | connections
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved data
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
      setArticles(saved);
      const conns = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '{}');
      setConnections(conns);
      const log = JSON.parse(localStorage.getItem(PUBLISH_LOG_KEY) || '[]');
      setPublishLog(log);
    } catch {}
  }, []);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleConnect = (platformId, fields) => {
    const updated = { ...connections, [platformId]: { ...fields, connectedAt: new Date().toISOString() } };
    setConnections(updated);
    try { localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updated)); } catch {}
    showNotif(`Connected to ${PLATFORMS.find(p => p.id === platformId)?.label}`);
  };

  const handleDisconnect = (platformId) => {
    const updated = { ...connections };
    delete updated[platformId];
    setConnections(updated);
    try { localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updated)); } catch {}
    showNotif(`Disconnected from ${PLATFORMS.find(p => p.id === platformId)?.label}`);
  };

  const handlePublished = (info) => {
    // Update article status
    const updatedArticles = articles.map(a =>
      a.id === selectedArticle?.id ? { ...a, publishStatus: info.platform === 'scheduled' ? 'scheduled' : 'published', publishedUrl: info.url } : a
    );
    setArticles(updatedArticles);
    try { localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles)); } catch {}

    // Add to publish log
    const logEntry = {
      id: Date.now(),
      articleTitle: selectedArticle?.keyword || selectedArticle?.title || 'Untitled',
      platform: info.platform,
      url: info.url,
      publishedAt: info.publishedAt,
      status: 'published',
    };
    const updatedLog = [logEntry, ...publishLog];
    setPublishLog(updatedLog);
    try { localStorage.setItem(PUBLISH_LOG_KEY, JSON.stringify(updatedLog)); } catch {}
  };

  const handleCopyHTML = async () => {
    if (!selectedArticle?.content) { showNotif('No article selected'); return; }
    const html = selectedArticle.content
      .split('\n')
      .map(line => {
        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        if (line.trim() === '') return '';
        return `<p>${line}</p>`;
      })
      .join('\n');
    await navigator.clipboard.writeText(html);
    showNotif('HTML copied to clipboard');
  };

  const handleDownload = (format) => {
    if (!selectedArticle?.content) { showNotif('No article selected'); return; }
    const fileName = (selectedArticle.keyword || 'article').replace(/\s+/g, '-').toLowerCase();
    let content = selectedArticle.content;
    let mime = 'text/plain';
    let ext = 'txt';
    if (format === 'html') {
      content = `<!DOCTYPE html>\n<html>\n<head><title>${selectedArticle.keyword || 'Article'}</title></head>\n<body>\n${content}\n</body>\n</html>`;
      mime = 'text/html'; ext = 'html';
    } else if (format === 'md') {
      mime = 'text/markdown'; ext = 'md';
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${fileName}.${ext}`; a.click();
    URL.revokeObjectURL(url);
    showNotif(`Downloaded as .${ext}`);
  };

  const filteredArticles = articles.filter(a =>
    (a.keyword || a.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedCount = Object.keys(connections).length;

  return (
    <>
      <style>{`
        .pub-input:focus { border-color: rgba(79,124,255,0.5) !important; }
        .pub-input::placeholder { color: #30363D; }
      `}</style>

      {/* Toast */}
      {notification && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', padding: '12px 18px', fontSize: '13px', color: '#E8EDF8', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          ✓ {notification}
        </div>
      )}

      {/* Modals */}
      {connectingPlatform && (
        <ConnectionModal
          platform={connectingPlatform}
          onClose={() => setConnectingPlatform(null)}
          onConnect={handleConnect}
        />
      )}
      {publishingPlatform && selectedArticle && (
        <PublishModal
          article={selectedArticle}
          platform={publishingPlatform}
          connection={connections[publishingPlatform.id]}
          onClose={() => setPublishingPlatform(null)}
          onPublished={handlePublished}
        />
      )}

      <div style={{ padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: 0, marginBottom: '6px' }}>🚀 Publish</h1>
          <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>
            Publish your articles to any platform in one click.
            {connectedCount > 0 && <span style={{ color: '#1DB8A0', marginLeft: '8px' }}>✓ {connectedCount} platform{connectedCount > 1 ? 's' : ''} connected</span>}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
          {[
            { key: 'publish', label: '🚀 Publish' },
            { key: 'log', label: `📋 Publish Log ${publishLog.length > 0 ? `(${publishLog.length})` : ''}` },
            { key: 'connections', label: `🔗 Connections ${connectedCount > 0 ? `(${connectedCount})` : ''}` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit',
              background: activeTab === tab.key ? '#161B22' : 'transparent',
              border: `1px solid ${activeTab === tab.key ? '#21262D' : 'transparent'}`,
              color: activeTab === tab.key ? '#E8EDF8' : '#8B949E',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ── PUBLISH TAB ── */}
        {activeTab === 'publish' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

            {/* Left: Article Selector */}
            <div>
              <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>
                  📄 Select Article
                </div>
                <input
                  className="pub-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  style={{ width: '100%', padding: '9px 12px', background: '#0D1117', border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8', fontSize: '12px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px' }}
                />
                {filteredArticles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
                    <div style={{ fontSize: '12px', color: '#8B949E', marginBottom: '10px' }}>No articles found.</div>
                    <a href="/dashboard/writer" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none', fontWeight: '600' }}>
                      ✍️ Write your first article →
                    </a>
                  </div>
                ) : (
                  filteredArticles.map(a => (
                    <ArticleCard key={a.id} article={a} selected={selectedArticle?.id === a.id} onSelect={setSelectedArticle} />
                  ))
                )}
              </div>
            </div>

            {/* Right: Platform Actions */}
            <div>
              {!selectedArticle ? (
                <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '60px 40px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👈</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>Select an article to publish</div>
                  <div style={{ fontSize: '13px', color: '#8B949E' }}>Choose an article from the left panel to see publishing options.</div>
                </div>
              ) : (
                <>
                  {/* Selected article preview */}
                  <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>Selected Article</div>
                      <button onClick={() => setSelectedArticle(null)} style={{ background: 'transparent', border: 'none', color: '#8B949E', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Deselect</button>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '6px' }}>
                      {selectedArticle.keyword || selectedArticle.title || 'Untitled Article'}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#8B949E' }}>
                      <span>📝 {selectedArticle.wordCount || 0} words</span>
                      <span>📊 SEO {selectedArticle.seoScore || 0}</span>
                      <span>📅 {selectedArticle.date || 'Today'}</span>
                    </div>
                  </div>

                  {/* Platform grid */}
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>
                    Choose Publishing Platform
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
                    {PLATFORMS.map(platform => {
                      const isConnected = !!connections[platform.id];

                      if (platform.id === 'copy') {
                        return (
                          <div key={platform.id} style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '22px' }}>{platform.icon}</span>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>{platform.label}</div>
                                <div style={{ fontSize: '11px', color: '#8B949E' }}>{platform.desc}</div>
                              </div>
                            </div>
                            <button onClick={handleCopyHTML} style={{ width: '100%', padding: '9px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(139,148,158,0.1)', border: '1px solid rgba(139,148,158,0.3)', color: '#8B949E' }}>
                              Copy HTML
                            </button>
                          </div>
                        );
                      }

                      if (platform.id === 'download') {
                        return (
                          <div key={platform.id} style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '22px' }}>{platform.icon}</span>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>{platform.label}</div>
                                <div style={{ fontSize: '11px', color: '#8B949E' }}>{platform.desc}</div>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              {['html', 'md'].map(fmt => (
                                <button key={fmt} onClick={() => handleDownload(fmt)} style={{ padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A' }}>
                                  .{fmt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={platform.id} style={{ background: '#161B22', border: `1px solid ${isConnected ? 'rgba(29,184,160,0.2)' : '#21262D'}`, borderRadius: '12px', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '22px' }}>{platform.icon}</span>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>{platform.label}</div>
                                <div style={{ fontSize: '11px', color: '#8B949E' }}>{platform.desc}</div>
                              </div>
                            </div>
                            {isConnected && (
                              <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', background: 'rgba(29,184,160,0.12)', color: '#1DB8A0', flexShrink: 0 }}>
                                Connected
                              </span>
                            )}
                          </div>
                          {isConnected ? (
                            <button
                              onClick={() => setPublishingPlatform(platform)}
                              style={{ width: '100%', padding: '9px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: `rgba(${platform.color === '#4F7CFF' ? '79,124,255' : platform.color === '#1DB8A0' ? '29,184,160' : platform.color === '#A78BFA' ? '167,139,250' : '245,158,11'},0.15)`, border: `1px solid ${platform.color}40`, color: platform.color }}
                            >
                              🚀 Publish to {platform.label}
                            </button>
                          ) : (
                            <button
                              onClick={() => setConnectingPlatform(platform)}
                              style={{ width: '100%', padding: '9px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}
                            >
                              + Connect {platform.label}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PUBLISH LOG TAB ── */}
        {activeTab === 'log' && (
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '16px' }}>Publish History</div>
            {publishLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#8B949E', fontSize: '13px' }}>
                No publish history yet. Start publishing articles to see logs here.
              </div>
            ) : (
              publishLog.map((entry, i) => {
                const platform = PLATFORMS.find(p => p.id === entry.platform);
                return (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < publishLog.length - 1 ? '1px solid #21262D' : 'none' }}>
                    <span style={{ fontSize: '20px' }}>{platform?.icon || '🌐'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.articleTitle}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8B949E' }}>
                        {platform?.label} · {new Date(entry.publishedAt).toLocaleString()}
                      </div>
                    </div>
                    {entry.url ? (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none', fontWeight: '600', flexShrink: 0 }}>View →</a>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: 'rgba(29,184,160,0.12)', color: '#1DB8A0' }}>Published</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── CONNECTIONS TAB ── */}
        {activeTab === 'connections' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
            {PLATFORMS.filter(p => p.id !== 'copy' && p.id !== 'download').map(platform => {
              const isConnected = !!connections[platform.id];
              const conn = connections[platform.id];
              return (
                <div key={platform.id} style={{ background: '#161B22', border: `1px solid ${isConnected ? 'rgba(29,184,160,0.2)' : '#21262D'}`, borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '28px' }}>{platform.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8', marginBottom: '2px' }}>{platform.label}</div>
                      <div style={{ fontSize: '12px', color: '#8B949E' }}>{platform.desc}</div>
                    </div>
                    {isConnected && (
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '5px', background: 'rgba(29,184,160,0.12)', color: '#1DB8A0' }}>
                        ✓ Connected
                      </span>
                    )}
                  </div>
                  {isConnected && conn.connectedAt && (
                    <div style={{ fontSize: '11px', color: '#8B949E', marginBottom: '12px' }}>
                      Connected {new Date(conn.connectedAt).toLocaleDateString()}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setConnectingPlatform(platform)}
                      style={{ flex: 1, padding: '9px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: isConnected ? 'transparent' : `rgba(79,124,255,0.1)`, border: `1px solid ${isConnected ? '#21262D' : 'rgba(79,124,255,0.3)'}`, color: isConnected ? '#8B949E' : '#4F7CFF' }}
                    >
                      {isConnected ? '✏️ Reconfigure' : '+ Connect'}
                    </button>
                    {isConnected && (
                      <button
                        onClick={() => handleDisconnect(platform.id)}
                        style={{ padding: '9px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A' }}
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}