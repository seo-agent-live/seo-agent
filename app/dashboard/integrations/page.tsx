'use client';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

const INTEGRATIONS_CATALOG = [
  {
    type: 'wordpress',
    label: 'WordPress',
    desc: 'Auto-publish articles directly to your WordPress site.',
    icon: '🌐',
    color: '#3b82f6',
    fields: [
      { key: 'site_url',     label: 'Site URL',       placeholder: 'https://yoursite.com' },
      { key: 'username',     label: 'Username',        placeholder: 'admin' },
      { key: 'app_password', label: 'App Password',    placeholder: 'xxxx xxxx xxxx xxxx', type: 'password' },
    ],
  },
  {
    type: 'openai',
    label: 'OpenAI',
    desc: 'Use your own OpenAI API key for content generation.',
    icon: '🤖',
    color: '#10b981',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'sk-...', type: 'password' },
    ],
  },
  {
    type: 'serper',
    label: 'Serper',
    desc: 'Power SEO research with real-time Google search data.',
    icon: '🔍',
    color: '#f59e0b',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Your Serper API key', type: 'password' },
    ],
  },
  {
    type: 'zapier',
    label: 'Zapier',
    desc: 'Trigger Zaps when articles are generated or published.',
    icon: '⚡',
    color: '#f97316',
    fields: [
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://hooks.zapier.com/...' },
    ],
  },
  {
    type: 'google_search_console',
    label: 'Google Search Console',
    desc: 'Track impressions, clicks and rankings for your content.',
    icon: '📊',
    color: '#6366f1',
    fields: [
      { key: 'site_url',     label: 'Site URL',              placeholder: 'https://yoursite.com' },
      { key: 'client_email', label: 'Service Account Email', placeholder: 'you@project.iam.gserviceaccount.com' },
      { key: 'private_key',  label: 'Private Key',           placeholder: '-----BEGIN PRIVATE KEY-----', type: 'password' },
    ],
  },
  {
    type: 'slack',
    label: 'Slack',
    desc: 'Get notified in Slack when articles are ready.',
    icon: '💬',
    color: '#8b5cf6',
    fields: [
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://hooks.slack.com/services/...' },
    ],
  },
];

export default function IntegrationsPage() {

  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [loading, setLoading]           = useState(true);
  const [openModal, setOpenModal]       = useState<string | null>(null);
  const [formValues, setFormValues]     = useState<Record<string, string>>({});
  const [saving, setSaving]             = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [toast, setToast]               = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('integrations')
        .select('id, type, config, connected, created_at');
      if (data) {
        const map: Record<string, any> = {};
        data.forEach((r: any) => { map[r.type] = r; });
        setIntegrations(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  const openConnect = (type: string) => {
    const existing = integrations[type];
    setFormValues(existing?.config ?? {});
    setOpenModal(type);
  };

  const handleSave = async () => {
    if (!openModal) return;
    setSaving(true);
    const existing = integrations[openModal];
    let error: any;

    if (existing) {
      ({ error } = await supabase.from('integrations').update({ config: formValues, connected: true }).eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('integrations').insert({ type: openModal, config: formValues, connected: true }));
    }

    if (!error) {
      const { data } = await supabase.from('integrations').select('id, type, config, connected, created_at');
      if (data) {
        const map: Record<string, any> = {};
        data.forEach((r: any) => { map[r.type] = r; });
        setIntegrations(map);
      }
      showToast(`${INTEGRATIONS_CATALOG.find(i => i.type === openModal)?.label} connected!`);
      setOpenModal(null);
    } else {
      showToast('Failed to save. Try again.', false);
    }
    setSaving(false);
  };

  const handleDisconnect = async (type: string) => {
    setDisconnecting(type);
    const existing = integrations[type];
    if (existing) {
      await supabase.from('integrations').update({ connected: false, config: {} }).eq('id', existing.id);
      setIntegrations(prev => ({ ...prev, [type]: { ...prev[type], connected: false, config: {} } }));
      showToast(`${INTEGRATIONS_CATALOG.find(i => i.type === type)?.label} disconnected.`, false);
    }
    setDisconnecting(null);
  };

  const connectedCount = Object.values(integrations).filter((i: any) => i.connected).length;
  const modal = INTEGRATIONS_CATALOG.find(c => c.type === openModal);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .int-root { min-height: 100vh; background: #0d0f14; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 64px; position: relative; }
        .int-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .inner { position: relative; z-index: 1; max-width: 1000px; }
        .int-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; display: flex; align-items: center; gap: 16px; transition: border-color 0.2s, background 0.2s; }
        .int-card:hover { background: rgba(255,255,255,0.038); border-color: rgba(124,111,255,0.18); }
        .int-card.connected { border-color: rgba(52,211,153,0.2); }
        .connect-btn { padding: 8px 18px; border-radius: 8px; border: 1px solid rgba(124,111,255,0.3); background: rgba(124,111,255,0.12); color: #a78bfa; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; white-space: nowrap; }
        .connect-btn:hover { background: rgba(124,111,255,0.22); }
        .disconnect-btn { padding: 8px 18px; border-radius: 8px; border: 1px solid rgba(248,113,113,0.2); background: rgba(248,113,113,0.08); color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; white-space: nowrap; }
        .disconnect-btn:hover { background: rgba(248,113,113,0.18); }
        .disconnect-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: #13151c; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 18px; }
        .modal-input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 11px 14px; color: #f1f5f9; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .modal-input:focus { border-color: rgba(124,111,255,0.5); box-shadow: 0 0 0 3px rgba(124,111,255,0.08); }
        .modal-input::placeholder { color: #334155; }
        .save-btn { padding: 11px; background: #7c6fff; border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
        .save-btn:hover:not(:disabled) { background: #6d5ff0; }
        .save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .cancel-btn { padding: 11px; background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .cancel-btn:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
        .toast { position: fixed; bottom: 28px; right: 28px; z-index: 100; padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif; pointer-events: none; animation: fadeUp 0.25s ease; }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 8px; animation: shimmer 1.5s ease infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.25s ease; }
      `}</style>

      <div className="int-root">
        <div className="inner">

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '5px' }}>Integrations</h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>Connect your tools to automate your SEO workflow.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Available',     value: INTEGRATIONS_CATALOG.length,                          color: '#7c6fff' },
              { label: 'Connected',     value: connectedCount,                                        color: '#34d399' },
              { label: 'Not Connected', value: INTEGRATIONS_CATALOG.length - connectedCount,          color: '#475569' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px 22px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>{s.label}</div>
                {loading
                  ? <div className="skeleton" style={{ width: '40px', height: '26px' }} />
                  : <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
                }
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '84px', borderRadius: '14px' }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INTEGRATIONS_CATALOG.map(item => {
                const record = integrations[item.type];
                const isConnected = record?.connected === true;
                return (
                  <div className={`int-card fade-up ${isConnected ? 'connected' : ''}`} key={item.type}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{item.label}</span>
                        {isConnected && (
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px', background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>Connected</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isConnected && record?.config && Object.values(record.config)[0]
                          ? `Configured · ${new Date(record.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : item.desc}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      {isConnected && <button className="connect-btn" onClick={() => openConnect(item.type)}>Edit</button>}
                      {isConnected ? (
                        <button className="disconnect-btn" disabled={disconnecting === item.type} onClick={() => handleDisconnect(item.type)}>
                          {disconnecting === item.type ? '…' : 'Disconnect'}
                        </button>
                      ) : (
                        <button className="connect-btn" onClick={() => openConnect(item.type)}>Connect</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {openModal && modal && (
        <div className="overlay" onClick={(e: any) => e.target === e.currentTarget && setOpenModal(null)}>
          <div className="modal fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', flexShrink: 0, background: `${modal.color}18`, border: `1px solid ${modal.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {modal.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>Connect {modal.label}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{modal.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modal.fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    className="modal-input"
                    type={f.type ?? 'text'}
                    placeholder={f.placeholder}
                    value={formValues[f.key] ?? ''}
                    onChange={e => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="cancel-btn" style={{ flex: 1 }} onClick={() => setOpenModal(null)}>Cancel</button>
              <button className="save-btn" style={{ flex: 2 }} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save & Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.ok ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', border: `1px solid ${toast.ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`, color: toast.ok ? '#34d399' : '#f87171' }}>
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </>
  );
}