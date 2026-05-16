'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const DEFAULTS = {
  general: {
    site_name: '',
    site_url: '',
    default_language: 'en',
    timezone: 'UTC',
  },
  seo: {
    default_tone: 'professional',
    article_length: '1500',
    auto_internal_links: true,
    include_faq: true,
    include_table_of_contents: false,
    target_keyword_density: '1.5',
  },
  notifications: {
    email_on_complete: false,
    email_on_fail: true,
    slack_notify: false,
    slack_webhook: '',
  },
};

const TABS = ['General', 'SEO', 'Notifications'];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer', flexShrink: 0, background: value ? '#7c6fff' : 'rgba(255,255,255,0.08)', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: '3px', left: value ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </div>
  );
}

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '2px' }}>{label}</div>
        {desc && <div style={{ fontSize: '12px', color: '#334155' }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
 
  const [tab, setTab]           = useState('General');
  const [settings, setSettings] = useState(DEFAULTS);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('*').limit(1).single();
      if (data) {
        setRecordId(data.id);
        setSettings({
          general:       { ...DEFAULTS.general,       ...(data.general       ?? {}) },
          seo:           { ...DEFAULTS.seo,           ...(data.seo           ?? {}) },
          notifications: { ...DEFAULTS.notifications, ...(data.notifications ?? {}) },
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const update = (section: string, key: string, value: any) => {
    setSettings(prev => ({ ...prev, [section]: { ...(prev as any)[section], [key]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      general:       settings.general,
      seo:           settings.seo,
      notifications: settings.notifications,
      updated_at:    new Date().toISOString(),
    };

    let error: any;
    if (recordId) {
      ({ error } = await supabase.from('settings').update(payload).eq('id', recordId));
    } else {
      const { data, error: e } = await supabase.from('settings').insert(payload).select().single();
      error = e;
      if (data) setRecordId(data.id);
    }

    if (!error) showToast('Settings saved!');
    else showToast('Failed to save.', false);
    setSaving(false);
  };

  const textInput = (section: string, key: string, placeholder = '', type = 'text') => (
    <input
      type={type}
      value={(settings as any)[section][key] ?? ''}
      onChange={e => update(section, key, e.target.value)}
      placeholder={placeholder}
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', padding: '9px 13px', color: '#f1f5f9', fontSize: '13px', fontFamily: 'Inter, sans-serif', outline: 'none', width: '220px', transition: 'border-color 0.15s, box-shadow 0.15s' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(124,111,255,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,111,255,0.08)'; }}
      onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
    />
  );

  const selectInput = (section: string, key: string, options: { value: string; label: string }[]) => (
    <select
      value={(settings as any)[section][key] ?? ''}
      onChange={e => update(section, key, e.target.value)}
      style={{ background: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', padding: '9px 13px', color: '#f1f5f9', fontSize: '13px', fontFamily: 'Inter, sans-serif', outline: 'none', width: '220px', cursor: 'pointer' }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .set-root { min-height: 100vh; background: #0d0f14; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 32px 32px 64px; position: relative; }
        .set-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .inner { position: relative; z-index: 1; max-width: 760px; }
        .glass { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; }
        .tab-btn { padding: 8px 18px; border-radius: 8px; border: none; background: transparent; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .tab-btn.active { background: rgba(124,111,255,0.15); color: #a78bfa; }
        .tab-btn:hover:not(.active) { color: #94a3b8; background: rgba(255,255,255,0.04); }
        .save-btn { padding: 10px 28px; background: #7c6fff; border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
        .save-btn:hover:not(:disabled) { background: #6d5ff0; }
        .save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .toast { position: fixed; bottom: 28px; right: 28px; z-index: 100; padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif; pointer-events: none; animation: fadeUp 0.25s ease; }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 8px; animation: shimmer 1.5s ease infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.25s ease; }
      `}</style>

      <div className="set-root">
        <div className="inner">

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '5px' }}>Settings</h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>Manage your account preferences and defaults.</p>
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
            {TABS.map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          {loading ? (
            <div className="glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '48px' }} />)}
            </div>
          ) : (
            <div className="glass fade-up">

              {tab === 'General' && (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>General</div>
                  <Field label="Site Name" desc="The name of your website or brand.">{textInput('general', 'site_name', 'My SEO Site')}</Field>
                  <Field label="Site URL" desc="Your website's root URL.">{textInput('general', 'site_url', 'https://yoursite.com')}</Field>
                  <Field label="Language" desc="Default language for generated content.">
                    {selectInput('general', 'default_language', [
                      { value: 'en', label: 'English' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'pt', label: 'Portuguese' },
                    ])}
                  </Field>
                  <Field label="Timezone" desc="Used for scheduling and timestamps.">
                    {selectInput('general', 'timezone', [
                      { value: 'UTC',                label: 'UTC' },
                      { value: 'Europe/London',       label: 'London (GMT)' },
                      { value: 'America/New_York',    label: 'New York (EST)' },
                      { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
                      { value: 'Asia/Tokyo',          label: 'Tokyo (JST)' },
                    ])}
                  </Field>
                </>
              )}

              {tab === 'SEO' && (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>SEO Defaults</div>
                  <Field label="Default Tone" desc="Writing tone for generated articles.">
                    {selectInput('seo', 'default_tone', [
                      { value: 'professional',  label: 'Professional' },
                      { value: 'casual',        label: 'Casual' },
                      { value: 'friendly',      label: 'Friendly' },
                      { value: 'authoritative', label: 'Authoritative' },
                    ])}
                  </Field>
                  <Field label="Article Length" desc="Target word count for generated articles.">
                    {selectInput('seo', 'article_length', [
                      { value: '800',  label: '800 words' },
                      { value: '1200', label: '1,200 words' },
                      { value: '1500', label: '1,500 words' },
                      { value: '2000', label: '2,000 words' },
                      { value: '3000', label: '3,000 words' },
                    ])}
                  </Field>
                  <Field label="Keyword Density" desc="Target keyword density percentage.">
                    {selectInput('seo', 'target_keyword_density', [
                      { value: '0.5', label: '0.5%' },
                      { value: '1.0', label: '1.0%' },
                      { value: '1.5', label: '1.5%' },
                      { value: '2.0', label: '2.0%' },
                    ])}
                  </Field>
                  <Field label="Auto Internal Links" desc="Automatically add internal links to articles.">
                    <Toggle value={!!settings.seo.auto_internal_links} onChange={v => update('seo', 'auto_internal_links', v)} />
                  </Field>
                  <Field label="Include FAQ Section" desc="Add a FAQ section at the end of articles.">
                    <Toggle value={!!settings.seo.include_faq} onChange={v => update('seo', 'include_faq', v)} />
                  </Field>
                  <Field label="Table of Contents" desc="Add a table of contents to long articles.">
                    <Toggle value={!!settings.seo.include_table_of_contents} onChange={v => update('seo', 'include_table_of_contents', v)} />
                  </Field>
                </>
              )}

              {tab === 'Notifications' && (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Notifications</div>
                  <Field label="Email on Complete" desc="Send email when article generation finishes.">
                    <Toggle value={!!settings.notifications.email_on_complete} onChange={v => update('notifications', 'email_on_complete', v)} />
                  </Field>
                  <Field label="Email on Failure" desc="Send email when generation fails.">
                    <Toggle value={!!settings.notifications.email_on_fail} onChange={v => update('notifications', 'email_on_fail', v)} />
                  </Field>
                  <Field label="Slack Notifications" desc="Send a message to Slack on completion.">
                    <Toggle value={!!settings.notifications.slack_notify} onChange={v => update('notifications', 'slack_notify', v)} />
                  </Field>
                  {settings.notifications.slack_notify && (
                    <Field label="Slack Webhook URL" desc="Your Slack incoming webhook URL.">
                      {textInput('notifications', 'slack_webhook', 'https://hooks.slack.com/services/...')}
                    </Field>
                  )}
                </>
              )}

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Settings'}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {toast && (
        <div className="toast" style={{ background: toast.ok ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', border: `1px solid ${toast.ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`, color: toast.ok ? '#34d399' : '#f87171' }}>
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </>
  );
}