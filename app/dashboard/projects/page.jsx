'use client';
import { useState, useEffect } from 'react';

const PROJECTS_KEY = 'rankflow_projects';
const ARTICLES_KEY = 'rankflow_articles';

const STATUSES = ['Active', 'Paused', 'Completed'];
const COLORS   = ['#4F7CFF', '#1DB8A0', '#F59E0B', '#E24B4A', '#A78BFA', '#D35486'];

const card = { background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' };
const inp  = { width: '100%', padding: '10px 12px', background: '#0D1117', border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
const lbl  = { fontSize: '11px', fontWeight: '600', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' };

function Modal({ onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ ...card, width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
      <div style={{ fontSize: '16px', fontWeight: '700', color: '#E8EDF8' }}>{title}</div>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8B949E', fontSize: '20px', cursor: 'pointer' }}>×</button>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects,    setProjects]    = useState([]);
  const [articles,    setArticles]    = useState([]);
  const [view,        setView]        = useState('list');   // list | detail
  const [active,      setActive]      = useState(null);
  const [modal,       setModal]       = useState(null);     // null | 'create' | 'edit' | 'addArticle'
  const [notif,       setNotif]       = useState('');
  const [search,      setSearch]      = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // form
  const [form, setForm] = useState({ name: '', description: '', domain: '', status: 'Active', color: COLORS[0], keywords: '' });
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    try {
      setProjects(JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'));
      setArticles(JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]'));
    } catch {}
  }, []);

  const save = (updated) => {
    setProjects(updated);
    try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated)); } catch {}
  };

  const toast = (msg) => { setNotif(msg); setTimeout(() => setNotif(''), 3000); };

  const openCreate = () => {
    setForm({ name: '', description: '', domain: '', status: 'Active', color: COLORS[0], keywords: '' });
    setFormErr('');
    setModal('create');
  };

  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, domain: p.domain, status: p.status, color: p.color, keywords: (p.keywords || []).join(', ') });
    setFormErr('');
    setModal('edit');
  };

  const handleSaveProject = () => {
    if (!form.name.trim()) { setFormErr('Project name is required.'); return; }
    if (modal === 'create') {
      const newProject = {
        id: Date.now(),
        name: form.name.trim(),
        description: form.description.trim(),
        domain: form.domain.trim(),
        status: form.status,
        color: form.color,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        articleIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      save([newProject, ...projects]);
      toast('Project created');
    } else {
      const updated = projects.map(p => p.id === active.id ? {
        ...p,
        name: form.name.trim(),
        description: form.description.trim(),
        domain: form.domain.trim(),
        status: form.status,
        color: form.color,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      } : p);
      save(updated);
      setActive(updated.find(p => p.id === active.id));
      toast('Project updated');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    save(projects.filter(p => p.id !== id));
    if (active?.id === id) { setActive(null); setView('list'); }
    toast('Project deleted');
  };

  const handleToggleArticle = (articleId) => {
    const updated = projects.map(p => {
      if (p.id !== active.id) return p;
      const ids = p.articleIds || [];
      return { ...p, articleIds: ids.includes(articleId) ? ids.filter(i => i !== articleId) : [...ids, articleId], updatedAt: new Date().toISOString() };
    });
    save(updated);
    setActive(updated.find(p => p.id === active.id));
  };

  const handleStatusChange = (id, status) => {
    const updated = projects.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p);
    save(updated);
    if (active?.id === id) setActive(updated.find(p => p.id === id));
    toast(`Status set to ${status}`);
  };

  const openDetail = (p) => { setActive(p); setView('detail'); };

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const projectArticles = active ? articles.filter(a => (active.articleIds || []).includes(a.id)) : [];
  const unlinkedArticles = articles.filter(a => !(active?.articleIds || []).includes(a.id));

  const statusColor = (s) => s === 'Active' ? '#1DB8A0' : s === 'Paused' ? '#F59E0B' : '#8B949E';
  const statusBg    = (s) => s === 'Active' ? 'rgba(29,184,160,0.12)' : s === 'Paused' ? 'rgba(245,158,11,0.12)' : 'rgba(139,148,158,0.12)';

  return (
    <>
      <style>{`.pr-input::placeholder{color:#30363D}.pr-input:focus{border-color:rgba(79,124,255,0.5)!important;outline:none}`}</style>

      {notif && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, background: '#161B22', border: '1px solid #21262D', borderRadius: '10px', padding: '12px 18px', fontSize: '13px', color: '#E8EDF8', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          ✓ {notif}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader title={modal === 'create' ? 'New Project' : 'Edit Project'} onClose={() => setModal(null)} />

          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Project Name *</label>
            <input className="pr-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder='e.g. "My SaaS Blog"' style={inp} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Website Domain</label>
            <input className="pr-input" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} placeholder='e.g. "mysite.com"' style={inp} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Description</label>
            <textarea className="pr-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder='What is this project about?' rows={2} style={{ ...inp, resize: 'vertical', lineHeight: '1.5' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Target Keywords</label>
            <input className="pr-input" value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder='seo tool, rank on google (comma separated)' style={inp} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Status</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} style={{ flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: '600', background: form.status === s ? statusBg(s) : '#0D1117', border: `1px solid ${form.status === s ? statusColor(s) : '#21262D'}`, color: form.status === s ? statusColor(s) : '#8B949E' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={lbl}>Project Color</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: form.color === c ? '3px solid white' : '3px solid transparent', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
              ))}
            </div>
          </div>

          {formErr && <div style={{ padding: '10px 14px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '8px', fontSize: '12px', color: '#E24B4A', marginBottom: '14px' }}>⚠️ {formErr}</div>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>Cancel</button>
            <button onClick={handleSaveProject} style={{ flex: 2, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: '#4F7CFF', border: 'none', color: 'white' }}>
              {modal === 'create' ? 'Create Project' : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}

      {/* Add Article Modal */}
      {modal === 'addArticle' && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader title="Link Articles" onClose={() => setModal(null)} />
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', fontSize: '13px', color: '#8B949E' }}>
              No articles yet. <a href="/dashboard/writer" style={{ color: '#4F7CFF', textDecoration: 'none', fontWeight: '600' }}>Write one →</a>
            </div>
          ) : (
            articles.map(a => {
              const linked = (active?.articleIds || []).includes(a.id);
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #21262D' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.keyword || a.title || 'Untitled'}</div>
                    <div style={{ fontSize: '11px', color: '#8B949E' }}>{a.wordCount || 0} words · {a.date || 'Today'}</div>
                  </div>
                  <button onClick={() => handleToggleArticle(a.id)} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: linked ? 'rgba(226,75,74,0.1)' : 'rgba(29,184,160,0.1)', border: `1px solid ${linked ? 'rgba(226,75,74,0.3)' : 'rgba(29,184,160,0.3)'}`, color: linked ? '#E24B4A' : '#1DB8A0' }}>
                    {linked ? 'Remove' : '+ Add'}
                  </button>
                </div>
              );
            })
          )}
          <button onClick={() => setModal(null)} style={{ width: '100%', marginTop: '16px', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: '#4F7CFF', border: 'none', color: 'white' }}>Done</button>
        </Modal>
      )}

      <div style={{ padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: '0 0 6px' }}>📁 Projects</h1>
            <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>Organise your articles and SEO work by project.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {view === 'detail' && (
              <button onClick={() => { setView('list'); setActive(null); }} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>← Back</button>
            )}
            <button onClick={openCreate} style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: '#4F7CFF', border: 'none', color: 'white' }}>+ New Project</button>
          </div>
        </div>

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <>
            {/* Search + filter */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input className="pr-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." style={{ ...inp, flex: 1, minWidth: '200px' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                {['All', ...STATUSES].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: filterStatus === s ? 'rgba(79,124,255,0.15)' : '#161B22', border: `1px solid ${filterStatus === s ? 'rgba(79,124,255,0.4)' : '#21262D'}`, color: filterStatus === s ? '#4F7CFF' : '#8B949E' }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            {projects.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Projects', value: projects.length, color: '#4F7CFF' },
                  { label: 'Active',    value: projects.filter(p => p.status === 'Active').length,    color: '#1DB8A0' },
                  { label: 'Paused',    value: projects.filter(p => p.status === 'Paused').length,    color: '#F59E0B' },
                  { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#8B949E' },
                ].map(s => (
                  <div key={s.label} style={card}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#8B949E' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '80px 40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>
                  {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
                </div>
                <div style={{ fontSize: '13px', color: '#8B949E', marginBottom: '24px' }}>
                  {projects.length === 0 ? 'Create a project to organise your SEO work.' : 'Try a different search or filter.'}
                </div>
                {projects.length === 0 && (
                  <button onClick={openCreate} style={{ padding: '10px 24px', background: '#4F7CFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>+ Create Project</button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filtered.map(p => {
                  const articleCount = (p.articleIds || []).length;
                  const kwCount = (p.keywords || []).length;
                  return (
                    <div key={p.id} style={{ ...card, borderLeft: `3px solid ${p.color}`, cursor: 'pointer' }} onClick={() => openDetail(p)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                            📁
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8EDF8' }}>{p.name}</div>
                            {p.domain && <div style={{ fontSize: '11px', color: '#8B949E' }}>{p.domain}</div>}
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: statusBg(p.status), color: statusColor(p.status), flexShrink: 0 }}>
                          {p.status}
                        </span>
                      </div>

                      {p.description && (
                        <div style={{ fontSize: '12px', color: '#8B949E', lineHeight: '1.5', marginBottom: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {p.description}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#8B949E', marginBottom: '14px' }}>
                        <span>📝 {articleCount} article{articleCount !== 1 ? 's' : ''}</span>
                        <span>🔑 {kwCount} keyword{kwCount !== 1 ? 's' : ''}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => openDetail(p)} style={{ flex: 1, padding: '7px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)', color: '#4F7CFF' }}>Open</button>
                        <button onClick={() => { setActive(p); openEdit(p); }} style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>✏️</button>
                        <button onClick={() => handleDelete(p.id)} style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── DETAIL VIEW ── */}
        {view === 'detail' && active && (
          <div>
            {/* Project header */}
            <div style={{ ...card, borderLeft: `4px solid ${active.color}`, marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>{active.name}</div>
                  {active.domain && <div style={{ fontSize: '13px', color: '#4F7CFF', marginBottom: '6px' }}>🌐 {active.domain}</div>}
                  {active.description && <div style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', maxWidth: '600px' }}>{active.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => handleStatusChange(active.id, s)} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: active.status === s ? statusBg(s) : 'transparent', border: `1px solid ${active.status === s ? statusColor(s) : '#21262D'}`, color: active.status === s ? statusColor(s) : '#8B949E' }}>{s}</button>
                  ))}
                  <button onClick={() => openEdit(active)} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(active.id)} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A' }}>🗑 Delete</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Articles', value: (active.articleIds || []).length, color: '#4F7CFF' },
                { label: 'Keywords', value: (active.keywords || []).length, color: '#1DB8A0' },
                { label: 'Last Updated', value: new Date(active.updatedAt || active.createdAt).toLocaleDateString(), color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} style={card}>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#8B949E' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Keywords */}
            {(active.keywords || []).length > 0 && (
              <div style={{ ...card, marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '12px' }}>🔑 Target Keywords</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {active.keywords.map((kw, i) => (
                    <span key={i} style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.25)', color: '#4F7CFF' }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8' }}>
                  📝 Articles ({projectArticles.length})
                </div>
                <button onClick={() => setModal('addArticle')} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)', color: '#4F7CFF' }}>
                  + Link Articles
                </button>
              </div>

              {projectArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
                  <div style={{ fontSize: '13px', color: '#8B949E', marginBottom: '12px' }}>No articles linked to this project yet.</div>
                  <button onClick={() => setModal('addArticle')} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(79,124,255,0.1)', border: '1px solid rgba(79,124,255,0.3)', color: '#4F7CFF' }}>
                    + Link Articles
                  </button>
                </div>
              ) : (
                projectArticles.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < projectArticles.length - 1 ? '1px solid #21262D' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F7CFF', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.keyword || a.title || 'Untitled'}</div>
                      <div style={{ fontSize: '11px', color: '#8B949E' }}>{a.wordCount || 0} words · SEO {a.seoScore || 0} · {a.date || 'Today'}</div>
                    </div>
                    <a href="/dashboard/writer" style={{ fontSize: '12px', color: '#4F7CFF', textDecoration: 'none', fontWeight: '600', flexShrink: 0 }}>View →</a>
                    <button onClick={() => handleToggleArticle(a.id)} style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A', flexShrink: 0 }}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}