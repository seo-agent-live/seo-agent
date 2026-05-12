'use client';
import { useState, useEffect } from 'react';

const statusColors = {
  'Draft': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  'In Progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  'Done': { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newArticle, setNewArticle] = useState({ title: '', status: 'Draft' });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selected) fetchArticles(selected.id);
  }, [selected]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects/list');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchArticles = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/articles?projectId=${projectId}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Project created!');
      setTimeout(() => setSuccess(null), 2000);
      setNewProject({ name: '', description: '' });
      setShowNewProject(false);
      fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await fetch('/api/projects/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSelected(null);
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddArticle = async () => {
    if (!newArticle.title.trim() || !selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects/add-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newArticle, projectId: selected.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNewArticle({ title: '', status: 'Draft' });
      setShowNewArticle(false);
      fetchArticles(selected.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArticleStatus = async (articleId, status) => {
    try {
      await fetch('/api/projects/update-article', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId, status }),
      });
      fetchArticles(selected.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProjectStatus = async (status) => {
    try {
      await fetch('/api/projects/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, status }),
      });
      setSelected(prev => ({ ...prev, status }));
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const getProgress = () => {
    if (!articles.length) return 0;
    return Math.round((articles.filter(a => a.status === 'Done').length / articles.length) * 100);
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Projects
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Organize your articles into projects and track progress.
      </p>

      {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

      {!selected ? (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>All Projects ({projects.length})</h2>
            <button onClick={() => setShowNewProject(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              + New Project
            </button>
          </div>

          {/* New Project Form */}
          {showNewProject && (
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>New Project</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Project Name *</label>
                <input value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} placeholder='e.g. Q2 SEO Campaign' style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description</label>
                <input value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder='e.g. Content campaign for Q2' style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCreateProject} disabled={loading} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <button onClick={() => setShowNewProject(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
              <p>No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {projects.map((project, i) => (
                <div key={i} onClick={() => setSelected(project)} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ fontSize: '28px' }}>📁</div>
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: statusColors[project.status]?.bg, color: statusColors[project.status]?.color, border: `1px solid ${statusColors[project.status]?.border}`, fontWeight: 600 }}>
                      {project.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>{project.name}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px' }}>{project.description || 'No description'}</p>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{new Date(project.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Back button */}
          <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '24px' }}>
            ← Back to Projects
          </button>

          {/* Project Header */}
          <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>{selected.name}</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{selected.description || 'No description'}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Draft', 'In Progress', 'Done'].map(s => (
                  <button key={s} onClick={() => handleUpdateProjectStatus(s)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid', borderColor: selected.status === s ? statusColors[s]?.color : 'rgba(255,255,255,0.1)', background: selected.status === s ? statusColors[s]?.bg : 'transparent', color: selected.status === s ? statusColors[s]?.color : '#64748b', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Progress</span>
                <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>{getProgress()}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${getProgress()}%`, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '99px', transition: 'width 0.3s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b' }}>
              <span>📝 {articles.length} articles</span>
              <span>✅ {articles.filter(a => a.status === 'Done').length} done</span>
              <span>⏳ {articles.filter(a => a.status === 'In Progress').length} in progress</span>
            </div>
          </div>

          {/* Articles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Articles</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowNewArticle(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add Article
              </button>
              <button onClick={() => handleDeleteProject(selected.id)} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                🗑️ Delete Project
              </button>
            </div>
          </div>

          {/* New Article Form */}
          {showNewArticle && (
            <div style={{ padding: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', alignItems: 'end' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Article Title</label>
                  <input value={newArticle.title} onChange={e => setNewArticle(p => ({ ...p, title: e.target.value }))} placeholder='e.g. Best SEO Tools 2025' style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <select value={newArticle.status} onChange={e => setNewArticle(p => ({ ...p, status: e.target.value }))} style={{ padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', marginTop: '20px' }}>
                  <option value="Draft" style={{ background: '#1a1740' }}>Draft</option>
                  <option value="In Progress" style={{ background: '#1a1740' }}>In Progress</option>
                  <option value="Done" style={{ background: '#1a1740' }}>Done</option>
                </select>
                <button onClick={handleAddArticle} disabled={loading} style={{ padding: '10px 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: '20px' }}>
                  Add
                </button>
              </div>
            </div>
          )}

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p>No articles yet. Add your first article!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {articles.map((article, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{article.title}</span>
                  <select value={article.status} onChange={e => handleUpdateArticleStatus(article.id, e.target.value)} style={{ padding: '6px 10px', backgroundColor: statusColors[article.status]?.bg, border: `1px solid ${statusColors[article.status]?.border}`, borderRadius: '6px', color: statusColors[article.status]?.color, fontSize: '12px', fontWeight: 600, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                    <option value="Draft" style={{ background: '#1a1740', color: '#fff' }}>Draft</option>
                    <option value="In Progress" style={{ background: '#1a1740', color: '#fff' }}>In Progress</option>
                    <option value="Done" style={{ background: '#1a1740', color: '#fff' }}>Done</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}