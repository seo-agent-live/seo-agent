'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles, Plus, Trash2, ChevronDown, ChevronUp,
  Loader2, Network, Tag, Edit2, Check, X, Search
} from 'lucide-react';

const COLORS = [
  'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'bg-amber-400/15 text-amber-400 border-amber-400/20',
  'bg-pink-500/15 text-pink-400 border-pink-500/20',
  'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'bg-violet-500/15 text-violet-400 border-violet-500/20',
];

export default function ClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');

  // AI generation
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Manual cluster creation
  const [newClusterName, setNewClusterName] = useState('');
  const [addingCluster, setAddingCluster] = useState(false);
  const [showNewCluster, setShowNewCluster] = useState(false);

  // Add keyword to cluster
  const [newKeyword, setNewKeyword] = useState({});
  const [addingKeyword, setAddingKeyword] = useState(null);

  // Rename cluster
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState('');

  // Search
  const [search, setSearch] = useState('');

  useEffect(() => { fetchClusters(); }, []);

  async function fetchClusters() {
    setLoading(true);
    try {
      const res = await fetch('/api/clusters');
      const data = await res.json();
      setClusters(data.clusters ?? []);
    } catch { setError('Failed to load clusters.'); }
    finally { setLoading(false); }
  }

  async function generateClusters() {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setError('');
    try {
      const res = await fetch('/api/clusters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClusters(prev => [...data.clusters, ...prev]);
      setAiTopic('');
    } catch (e) { setError(e.message); }
    finally { setAiLoading(false); }
  }

  async function createCluster() {
    if (!newClusterName.trim()) return;
    setAddingCluster(true);
    try {
      const res = await fetch('/api/clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClusterName.trim(), keywords: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClusters(prev => [data.cluster, ...prev]);
      setNewClusterName('');
      setShowNewCluster(false);
    } catch (e) { setError(e.message); }
    finally { setAddingCluster(false); }
  }

  async function deleteCluster(id) {
    try {
      await fetch(`/api/clusters/${id}`, { method: 'DELETE' });
      setClusters(prev => prev.filter(c => c.id !== id));
    } catch { setError('Failed to delete cluster.'); }
  }

  async function addKeyword(clusterId) {
    const kw = (newKeyword[clusterId] ?? '').trim();
    if (!kw) return;
    setAddingKeyword(clusterId);
    try {
      const res = await fetch(`/api/clusters/${clusterId}/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClusters(prev => prev.map(c =>
        c.id === clusterId ? { ...c, keywords: [...(c.keywords ?? []), data.keyword] } : c
      ));
      setNewKeyword(prev => ({ ...prev, [clusterId]: '' }));
    } catch (e) { setError(e.message); }
    finally { setAddingKeyword(null); }
  }

  async function removeKeyword(clusterId, keywordId) {
    try {
      await fetch(`/api/clusters/${clusterId}/keywords/${keywordId}`, { method: 'DELETE' });
      setClusters(prev => prev.map(c =>
        c.id === clusterId
          ? { ...c, keywords: (c.keywords ?? []).filter(k => k.id !== keywordId) }
          : c
      ));
    } catch { setError('Failed to remove keyword.'); }
  }

  async function renameCluster(id) {
    if (!renameVal.trim()) return;
    try {
      await fetch(`/api/clusters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameVal.trim() }),
      });
      setClusters(prev => prev.map(c => c.id === id ? { ...c, name: renameVal.trim() } : c));
      setRenaming(null);
    } catch { setError('Failed to rename.'); }
  }

  const filtered = clusters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.keywords ?? []).some(k => k.keyword?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0d0d14] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] shrink-0">
        <p className="text-xs text-white/30">
          <span className="text-white/50">SEOAgent</span>
          <span className="mx-1.5 text-white/20">/</span>
          Clusters
        </p>
        <span className="text-xs text-white/30">{clusters.length} clusters</span>
      </header>

      <main className="flex-1 px-8 py-8 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-tight mb-1">Keyword Clusters</h1>
          <p className="text-sm text-white/35">Group related keywords into topic clusters. Use AI to generate or build manually.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="space-y-4">
            {/* AI Generation */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indigo-400" />
                <h2 className="text-sm font-semibold text-white/80">AI Cluster Generator</h2>
              </div>
              <p className="text-xs text-white/30 mb-3">Enter a topic and AI will generate a full cluster map with pillar + supporting keywords.</p>
              <div className="space-y-2">
                <input
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateClusters()}
                  placeholder="e.g. content marketing for SaaS"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button
                  onClick={generateClusters}
                  disabled={aiLoading || !aiTopic.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {aiLoading ? 'Generating...' : 'Generate Clusters'}
                </button>
              </div>
            </div>

            {/* Manual creation */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Network size={14} className="text-white/50" />
                <h2 className="text-sm font-semibold text-white/80">Manual Cluster</h2>
              </div>
              {showNewCluster ? (
                <div className="space-y-2">
                  <input
                    value={newClusterName}
                    onChange={e => setNewClusterName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createCluster()}
                    placeholder="Cluster name..."
                    autoFocus
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button onClick={createCluster} disabled={addingCluster || !newClusterName.trim()}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-semibold transition-colors">
                      {addingCluster ? 'Creating...' : 'Create'}
                    </button>
                    <button onClick={() => { setShowNewCluster(false); setNewClusterName(''); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 text-xs transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowNewCluster(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/[0.1] hover:border-white/[0.2] text-white/40 hover:text-white/60 text-sm transition-colors">
                  <Plus size={14} /> New Cluster
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white/90">{clusters.length}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Clusters</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white/90">
                  {clusters.reduce((sum, c) => sum + (c.keywords?.length ?? 0), 0)}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Keywords</p>
              </div>
            </div>
          </div>

          {/* Right: Clusters list */}
          <div className="lg:col-span-2 space-y-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2">
              <Search size={13} className="text-white/25 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search clusters or keywords..."
                className="flex-1 bg-transparent text-sm text-white/60 placeholder-white/20 outline-none"
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Network size={28} className="text-white/10 mb-3" />
                <p className="text-sm text-white/30">
                  {search ? 'No clusters match your search' : 'No clusters yet'}
                </p>
                <p className="text-xs text-white/20 mt-1">
                  {search ? 'Try a different search' : 'Generate with AI or create manually'}
                </p>
              </div>
            ) : (
              filtered.map((cluster, ci) => {
                const color = COLORS[ci % COLORS.length];
                const isOpen = expanded === cluster.id;
                return (
                  <div key={cluster.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.1] transition-colors">
                    {/* Cluster header */}
                    <div className="flex items-center gap-3 px-5 py-4 cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : cluster.id)}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${color.split(' ')[1].replace('text-', 'bg-').replace('/40', '/70')}`} />

                      {renaming === cluster.id ? (
                        <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                          <input
                            value={renameVal}
                            onChange={e => setRenameVal(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && renameCluster(cluster.id)}
                            autoFocus
                            className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-sm text-white/80 outline-none focus:border-indigo-500/50"
                          />
                          <button onClick={() => renameCluster(cluster.id)} className="text-emerald-400 hover:text-emerald-300">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setRenaming(null)} className="text-white/30 hover:text-white/60">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-white/80 truncate block">{cluster.name}</span>
                          <span className="text-xs text-white/30">{cluster.keywords?.length ?? 0} keywords</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setRenaming(cluster.id); setRenameVal(cluster.name); }}
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/20 hover:text-white/60 transition-colors">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => deleteCluster(cluster.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                        {isOpen
                          ? <ChevronUp size={14} className="text-white/30 ml-1" />
                          : <ChevronDown size={14} className="text-white/30 ml-1" />}
                      </div>
                    </div>

                    {/* Keywords */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-white/[0.05]">
                        {/* Keyword pills */}
                        <div className="flex flex-wrap gap-2 mt-4 mb-4 min-h-[32px]">
                          {(cluster.keywords ?? []).length === 0 && (
                            <p className="text-xs text-white/25 italic">No keywords yet — add one below</p>
                          )}
                          {(cluster.keywords ?? []).map(kw => (
                            <div key={kw.id}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${color}`}>
                              <Tag size={10} />
                              <span>{kw.keyword}</span>
                              <button
                                onClick={() => removeKeyword(cluster.id, kw.id)}
                                className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity">
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add keyword input */}
                        <div className="flex gap-2">
                          <input
                            value={newKeyword[cluster.id] ?? ''}
                            onChange={e => setNewKeyword(prev => ({ ...prev, [cluster.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addKeyword(cluster.id)}
                            placeholder="Add keyword..."
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white/70 placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                          />
                          <button
                            onClick={() => addKeyword(cluster.id)}
                            disabled={addingKeyword === cluster.id || !newKeyword[cluster.id]?.trim()}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-50 text-white/60 text-xs font-semibold transition-colors">
                            {addingKeyword === cluster.id
                              ? <Loader2 size={11} className="animate-spin" />
                              : <Plus size={11} />}
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}