'use client';
import { useState, useEffect } from 'react';

const integrationsList = [
  {
    id: 'wordpress',
    name: 'WordPress',
    desc: 'Publish articles directly to your WordPress site.',
    icon: '🌐',
    color: 'rgba(33,150,243,0.15)',
    border: 'rgba(33,150,243,0.3)',
    fields: [
      { key: 'url', label: 'WordPress URL', placeholder: 'https://yoursite.com', type: 'text' },
      { key: 'username', label: 'Username', placeholder: 'admin', type: 'text' },
      { key: 'password', label: 'Application Password', placeholder: 'xxxx xxxx xxxx xxxx', type: 'password' },
    ],
  },
  {
    id: 'webflow',
    name: 'Webflow',
    desc: 'Publish content to your Webflow CMS collections.',
    icon: '🎨',
    color: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
    fields: [
      { key: 'apiKey', label: 'Webflow API Key', placeholder: 'Enter your Webflow API key', type: 'password' },
      { key: 'siteId', label: 'Site ID', placeholder: 'Enter your Webflow Site ID', type: 'text' },
      { key: 'collectionId', label: 'Collection ID', placeholder: 'Enter your CMS Collection ID', type: 'text' },
    ],
  },
  {
    id: 'google_search_console',
    name: 'Google Search Console',
    desc: 'Track your keyword rankings and search performance.',
    icon: '📊',
    color: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.3)',
    fields: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://yoursite.com', type: 'text' },
      { key: 'apiKey', label: 'API Key', placeholder: 'Enter your Google API key', type: 'password' },
    ],
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState({});
  const [selected, setSelected] = useState(null);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations/list');
      const data = await res.json();
      const map = {};
      (data.integrations || []).forEach(i => { map[i.type] = i; });
      setIntegrations(map);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/integrations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected.id, config, connected: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess(`${selected.name} connected successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      fetchIntegrations();
      setSelected(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (type) => {
    try {
      await fetch('/api/integrations/disconnect', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      setSuccess('Integration disconnected.');
      setTimeout(() => setSuccess(null), 2000);
      fetchIntegrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTest = async () => {
    if (!selected) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected.id, config }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleEdit = (integration) => {
    const def = integrationsList.find(i => i.id === integration.type);
    setSelected(def);
    setConfig(integration.config || {});
    setTestResult(null);
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Integrations
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Connect SEOAgent to your favorite tools and platforms.
      </p>

      {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

      {!selected ? (
        <div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '16px 24px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#6366f1' }}>{Object.values(integrations).filter(i => i.connected).length}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Connected</div>
            </div>
            <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#94a3b8' }}>{integrationsList.length - Object.values(integrations).filter(i => i.connected).length}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Available</div>
            </div>
          </div>

          {/* Integrations Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {integrationsList.map(integration => {
              const saved = integrations[integration.id];
              const isConnected = saved?.connected;
              return (
                <div key={integration.id} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${isConnected ? integration.border : 'rgba(255,255,255,0.07)'}`, borderRadius: '16px', position: 'relative' }}>
                  {isConnected && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  )}
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: integration.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px' }}>{integration.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>{integration.name}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>{integration.desc}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setSelected(integration);
                        setConfig(saved?.config || {});
                        setTestResult(null);
                        setError(null);
                      }}
                      style={{ flex: 1, padding: '9px', background: isConnected ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: isConnected ? '1px solid rgba(99,102,241,0.3)' : 'none', borderRadius: '8px', color: isConnected ? '#a5b4fc' : '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {isConnected ? '⚙️ Configure' : '+ Connect'}
                    </button>
                    {isConnected && (
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {isConnected && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>●</span> Connected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {/* Back */}
          <button onClick={() => { setSelected(null); setTestResult(null); setError(null); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '24px' }}>
            ← Back to Integrations
          </button>

          {/* Config Form */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{selected.icon}</div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{selected.name}</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{selected.desc}</p>
              </div>
            </div>

            {selected.fields.map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>{field.label}</label>
                <input
                  value={config[field.key] || ''}
                  onChange={e => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  type={field.type}
                  style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            {/* Test Result */}
            {testResult && (
              <div style={{ padding: '12px 16px', background: testResult.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${testResult.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '8px', color: testResult.success ? '#10b981' : '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                {testResult.success ? '✅ ' : '❌ '}{testResult.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleConnect} disabled={loading} style={{ flex: 1, padding: '12px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Saving...' : '💾 Save Connection'}
              </button>
              <button onClick={handleTest} disabled={testing} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', fontSize: '14px', cursor: testing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {testing ? 'Testing...' : '🔌 Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}