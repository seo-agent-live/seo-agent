'use client';
import { useState, useEffect } from 'react';

const statusColors = {
  'Published': { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  'Draft': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  'Archived': { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
};

export default function LibraryPage() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState({ title: '', content: '', status: 'Draft' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    let result = [...articles];
    if (search) result = result.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'All') result = result.filter(a => a.status === statusFilter);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === 'title') result.sort((a, b) => a.title?.localeCompare(b.title));
    setFiltered(result);
  }, [articles, search, statusFilter, sortBy]);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/library/list');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      await fetch('/api/library/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSelected(null);
      fetchArticles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (article) => {
    setEditContent({ title: article.title, content: article.content, status: article.status || 'Draft' });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/library/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, ...editContent }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess('Article updated!');
      setTimeout(() => setSuccess(null), 2000);
      setEditing(false);
      fetchArticles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportMarkdown = (article) => {
    const text = `# ${article.title}\n\n${article.content}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title?.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
  };

  const handleExportHTML = (article) => {
    const html = `<!DOCTYPE html><html><head><title>${article.title}</title></head><body><h1>${article.title}</h1>${article.content?.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n')}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title?.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
  };

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Article Library
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
        Browse, search, edit, and export all your saved articles.
      </p>

      {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

      {!selected ? (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search articles...'
              style={{ flex: 1, minWidth: '200px', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="All" style={{ background: '#1a1740' }}>All Status</option>
              <option value="Published" style={{ background: '#1a1740' }}>Published</option>
              <option value="Draft" style={{ background: '#1a1740' }}>Draft</option>
              <option value="Archived" style={{ background: '#1a1740' }}>Archived</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="newest" style={{ background: '#1a1740' }}>Newest First</option>
              <option value="oldest" style={{ background: '#1a1740' }}>Oldest First</option>
              <option value="title" style={{ background: '#1a1740' }}>Title A-Z</option>
            </select>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total', value: articles.length, color: '#6366f1' },
              { label: 'Published', value: articles.filter(a => a.status === 'Published').length, color: '#10b981' },
              { label: 'Draft', value: articles.filter(a => a.status === 'Draft').length, color: '#f59e0b' },
              { label: 'Archived', value: articles.filter(a => a.status === 'Archived').length, color: '#64748b' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Articles List */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
              <p>{search || statusFilter !== 'All' ? 'No articles match your filters.' : 'No articles yet. Generate your first article!'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {filtered.map((article, i) => (
                <div key={i} onClick={() => setSelected(article)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>{article.title}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      {new Date(article.created_at).toLocaleDateString()} · {article.content?.split(' ').length || 0} words
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: statusColors[article.status || 'Draft']?.bg, color: statusColors[article.status || 'Draft']?.color, border: `1px solid ${statusColors[article.status || 'Draft']?.border}`, fontWeight: 600 }}>
                      {article.status || 'Draft'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Back */}
          <button onClick={() => { setSelected(null); setEditing(false); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '24px' }}>
            ← Back to Library
          </button>

          {!editing ? (
            <div>
              {/* Article Header */}
              <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1, marginRight: '16px' }}>{selected.title}</h2>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: statusColors[selected.status || 'Draft']?.bg, color: statusColors[selected.status || 'Draft']?.color, border: `1px solid ${statusColors[selected.status || 'Draft']?.border}`, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {selected.status || 'Draft'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  Created {new Date(selected.created_at).toLocaleDateString()} · {selected.content?.split(' ').length || 0} words
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => handleEdit(selected)} style={{ padding: '10px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleExportMarkdown(selected)} style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ⬇️ Markdown
                </button>
                <button onClick={() => handleExportHTML(selected)} style={{ padding: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', color: '#f59e0b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ⬇️ HTML
                </button>
                <button onClick={() => handleDelete(selected.id)} style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  🗑️ Delete
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#cbd5e1', margin: 0, lineHeight: '1.8' }}>
                  {selected.content}
                </pre>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '20px' }}>Edit Article</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Title</label>
                <input value={editContent.title} onChange={e => setEditContent(p => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
                <select value={editContent.status} onChange={e => setEditContent(p => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option value="Draft" style={{ background: '#1a1740' }}>Draft</option>
                  <option value="Published" style={{ background: '#1a1740' }}>Published</option>
                  <option value="Archived" style={{ background: '#1a1740' }}>Archived</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Content</label>
                <textarea value={editContent.content} onChange={e => setEditContent(p => ({ ...p, content: e.target.value }))} rows={16} style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', lineHeight: '1.8', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSaveEdit} disabled={loading} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}