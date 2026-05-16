'use client';
import { useState, useRef } from 'react';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'educational', label: 'Educational' },
];

const LENGTHS = [
  { value: 'short', label: 'Short', desc: '500–800 words' },
  { value: 'medium', label: 'Medium', desc: '1,000–1,500 words' },
  { value: 'long', label: 'Long', desc: '2,000+ words' },
];

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'portuguese', label: 'Portuguese' },
];

const ARTICLE_TYPES = [
  { value: 'how-to', label: 'How-To Guide' },
  { value: 'listicle', label: 'Listicle' },
  { value: 'review', label: 'Review' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'informational', label: 'Informational' },
  { value: 'opinion', label: 'Opinion Piece' },
];

function getSeoScore(content, keyword) {
  if (!content || !keyword) return 0;
  let score = 50;
  const lower = content.toLowerCase();
  const kw = keyword.toLowerCase();
  const wordCount = content.split(/\s+/).length;
  if (lower.includes(kw)) score += 15;
  const kwCount = (lower.match(new RegExp(kw, 'g')) || []).length;
  const density = (kwCount / wordCount) * 100;
  if (density >= 1 && density <= 3) score += 10;
  if (wordCount > 1000) score += 10;
  if (wordCount > 2000) score += 5;
  if (content.includes('##') || content.includes('**')) score += 5;
  if (content.includes('\n\n')) score += 5;
  return Math.min(score, 100);
}

function getReadTime(content) {
  const words = content?.split(/\s+/).length || 0;
  const mins = Math.ceil(words / 200);
  return `${mins} min`;
}

function getWordCount(content) {
  return content?.split(/\s+/).filter(Boolean).length || 0;
}

const loadingMessages = [
  'Researching your keyword...',
  'Analysing top-ranking content...',
  'Crafting your article structure...',
  'Writing introduction...',
  'Expanding body sections...',
  'Optimising for SEO...',
  'Adding finishing touches...',
];

export default function WriterPage() {
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('long');
  const [language, setLanguage] = useState('english');
  const [articleType, setArticleType] = useState('how-to');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [includeMetaDesc, setIncludeMetaDesc] = useState(true);
  const [includeFAQ, setIncludeFAQ] = useState(true);
  const [includeConclusion, setIncludeConclusion] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [activeTab, setActiveTab] = useState('article');
  const [savedArticles, setSavedArticles] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  const editorRef = useRef(null);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setArticle(null);
    setEditMode(false);
    setActiveTab('article');

    let msgIdx = 0;
    setLoadingMsg(loadingMessages[0]);
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIdx]);
    }, 2500);

    try {
      const res = await fetch('/api/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword, tone, length, language, articleType,
          additionalInstructions, includeMetaDesc, includeFAQ, includeConclusion,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setArticle(data);
      setEditedContent(data.content);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const content = editMode ? editedContent : article?.content;
    navigator.clipboard.writeText(content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = editMode ? editedContent : article?.content;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const saved = {
      id: Date.now(),
      keyword,
      content: editMode ? editedContent : article?.content,
      metaDescription: article?.metaDescription,
      metaTitle: article?.metaTitle,
      seoScore: getSeoScore(editMode ? editedContent : article?.content, keyword),
      wordCount: getWordCount(editMode ? editedContent : article?.content),
      date: new Date().toLocaleDateString(),
    };
    setSavedArticles(prev => [saved, ...prev]);
    try {
      const existing = JSON.parse(localStorage.getItem('rankflow_articles') || '[]');
      localStorage.setItem('rankflow_articles', JSON.stringify([saved, ...existing].slice(0, 20)));
    } catch {}
  };

  const displayContent = editMode ? editedContent : article?.content;
  const seoScore = article ? getSeoScore(displayContent, keyword) : 0;
  const wordCount = getWordCount(displayContent);
  const readTime = getReadTime(displayContent);
  const scoreColor = seoScore >= 80 ? '#1DB8A0' : seoScore >= 60 ? '#F59E0B' : '#E24B4A';

  const seoTips = article ? [
    { pass: displayContent?.toLowerCase().includes(keyword.toLowerCase()), label: `Keyword "${keyword}" appears in content` },
    { pass: wordCount > 1000, label: 'Article is over 1,000 words' },
    { pass: wordCount > 1500, label: 'Article is over 1,500 words (ideal)' },
    { pass: displayContent?.includes('##') || displayContent?.includes('\n#'), label: 'Uses heading structure (H2s)' },
    { pass: !!article?.metaDescription, label: 'Has a meta description' },
    { pass: article?.metaDescription?.length >= 120 && article?.metaDescription?.length <= 160, label: 'Meta description is 120–160 chars' },
    { pass: (displayContent?.toLowerCase().split(keyword.toLowerCase()).length || 1) - 1 >= 3, label: 'Keyword used 3+ times' },
    { pass: displayContent?.includes('FAQ') || displayContent?.includes('?'), label: 'Includes FAQ or questions' },
  ] : [];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#0D1117',
    border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: '600', color: '#8B949E',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: '8px',
  };

  return (
    <div style={{ padding: '28px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: 0, marginBottom: '6px' }}>✍️ AI Writer</h1>
          <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>Generate long-form, SEO-optimised articles with one keyword.</p>
        </div>
        <button
          onClick={() => setShowSaved(!showSaved)}
          style={{
            fontSize: '12px', padding: '8px 16px', borderRadius: '8px',
            border: '1px solid #21262D', background: showSaved ? '#161B22' : 'transparent',
            color: '#8B949E', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          📁 Saved Articles {savedArticles.length > 0 && `(${savedArticles.length})`}
        </button>
      </div>

      {/* Saved Articles Panel */}
      {showSaved && (
        <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>Saved Articles</div>
          {savedArticles.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#8B949E', textAlign: 'center', padding: '20px 0' }}>No saved articles yet.</div>
          ) : savedArticles.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #21262D' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '2px' }}>{a.keyword}</div>
                <div style={{ fontSize: '11px', color: '#8B949E' }}>{a.wordCount} words · SEO {a.seoScore} · {a.date}</div>
              </div>
              <button
                onClick={() => { setArticle(a); setEditedContent(a.content); setShowSaved(false); setKeyword(a.keyword); }}
                style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(79,124,255,0.3)', background: 'rgba(79,124,255,0.1)', color: '#4F7CFF', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Load
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* LEFT: Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Keyword */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>🎯 Target Keyword</div>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder='e.g. "best SEO tools for small business"'
              style={{ ...inputStyle, cursor: 'text' }}
            />
            <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '8px' }}>Press Enter or click Generate</div>
          </div>

          {/* Settings */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '16px' }}>⚙️ Settings</div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Article Type</label>
              <select value={articleType} onChange={e => setArticleType(e.target.value)} style={inputStyle}>
                {ARTICLE_TYPES.map(t => <option key={t.value} value={t.value} style={{ background: '#0D1117' }}>{t.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Tone of Voice</label>
              <select value={tone} onChange={e => setTone(e.target.value)} style={inputStyle}>
                {TONES.map(t => <option key={t.value} value={t.value} style={{ background: '#0D1117' }}>{t.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Article Length</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {LENGTHS.map(l => (
                  <button key={l.value} onClick={() => setLength(l.value)} style={{
                    padding: '10px 6px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                    background: length === l.value ? 'rgba(79,124,255,0.15)' : '#0D1117',
                    border: `1px solid ${length === l.value ? 'rgba(79,124,255,0.5)' : '#21262D'}`,
                    color: length === l.value ? '#4F7CFF' : '#8B949E',
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>{l.label}</div>
                    <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.7 }}>{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value} style={{ background: '#0D1117' }}>{l.label}</option>)}
              </select>
            </div>
          </div>

          {/* Include Sections */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>📋 Include Sections</div>
            {[
              { label: 'Meta Description', val: includeMetaDesc, set: setIncludeMetaDesc },
              { label: 'FAQ Section', val: includeFAQ, set: setIncludeFAQ },
              { label: 'Conclusion', val: includeConclusion, set: setIncludeConclusion },
            ].map((opt, i, arr) => (
              <div key={opt.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #21262D' : 'none' }}>
                <span style={{ fontSize: '13px', color: '#C9D1D9' }}>{opt.label}</span>
                <button onClick={() => opt.set(!opt.val)} style={{ width: '40px', height: '22px', borderRadius: '999px', border: 'none', background: opt.val ? '#4F7CFF' : '#21262D', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: '3px', left: opt.val ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Additional Instructions */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '10px' }}>💬 Additional Instructions</div>
            <textarea
              value={additionalInstructions}
              onChange={e => setAdditionalInstructions(e.target.value)}
              placeholder='e.g. "Focus on enterprise customers", "Include statistics", "Mention our product naturally"...'
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5', cursor: 'text' }}
            />
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={loading || !keyword.trim()}
            style={{
              width: '100%', padding: '14px',
              background: loading || !keyword.trim() ? 'rgba(79,124,255,0.3)' : '#4F7CFF',
              border: 'none', borderRadius: '10px', color: 'white',
              fontSize: '14px', fontWeight: '700',
              cursor: loading || !keyword.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading ? '⏳ Generating...' : '✍️ Generate Article'}
          </button>
        </div>

        {/* RIGHT: Output */}
        <div>
          {/* Error */}
          {error && (
            <div style={{ padding: '16px 20px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '10px', color: '#E24B4A', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✍️</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>{loadingMsg}</div>
              <div style={{ fontSize: '12px', color: '#8B949E', marginBottom: '24px' }}>Long articles may take up to 30 seconds.</div>
              <div style={{ background: '#21262D', borderRadius: '999px', height: '4px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #4F7CFF, #1DB8A0)', borderRadius: '999px', width: '70%' }} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !article && !error && (
            <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>Ready to write</div>
              <div style={{ fontSize: '13px', color: '#8B949E', maxWidth: '320px', margin: '0 auto', lineHeight: '1.6' }}>
                Enter a keyword on the left and click Generate. Your SEO-optimised article will appear here.
              </div>
            </div>
          )}

          {/* Article Output */}
          {article && !loading && (
            <div>
              {/* Stats + Actions Bar */}
              <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '16px 20px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {[
                    { label: 'Words', value: wordCount, color: '#4F7CFF' },
                    { label: 'Read Time', value: readTime, color: '#1DB8A0' },
                    { label: 'SEO Score', value: seoScore, color: scoreColor },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '11px', color: '#8B949E' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: editMode ? '✓ Editing' : '✏️ Edit', onClick: () => setEditMode(!editMode), active: editMode },
                    { label: copied ? '✓ Copied' : '📋 Copy', onClick: handleCopy, active: copied },
                    { label: '⬇️ Download', onClick: handleDownload, active: false },
                    { label: '💾 Save', onClick: handleSave, primary: true },
                  ].map(btn => (
                    <button key={btn.label} onClick={btn.onClick} style={{
                      padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'inherit',
                      background: btn.primary ? 'rgba(79,124,255,0.15)' : btn.active ? 'rgba(29,184,160,0.15)' : 'transparent',
                      border: `1px solid ${btn.primary ? 'rgba(79,124,255,0.4)' : btn.active ? '#1DB8A0' : '#21262D'}`,
                      color: btn.primary ? '#4F7CFF' : btn.active ? '#1DB8A0' : '#8B949E',
                    }}>{btn.label}</button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[
                  { key: 'article', label: '📄 Article' },
                  { key: 'meta', label: '🔖 Meta' },
                  { key: 'seo', label: '📊 SEO Analysis' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'inherit',
                    background: activeTab === tab.key ? '#161B22' : 'transparent',
                    border: `1px solid ${activeTab === tab.key ? '#21262D' : 'transparent'}`,
                    color: activeTab === tab.key ? '#E8EDF8' : '#8B949E',
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* Article Tab */}
              {activeTab === 'article' && (
                <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', overflow: 'hidden' }}>
                  {editMode ? (
                    <textarea
                      ref={editorRef}
                      value={editedContent}
                      onChange={e => setEditedContent(e.target.value)}
                      style={{ width: '100%', minHeight: '600px', padding: '28px', background: 'transparent', border: 'none', outline: 'none', color: '#C9D1D9', fontSize: '14px', lineHeight: '1.8', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <div style={{ padding: '28px' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', color: '#C9D1D9', margin: 0, lineHeight: '1.8' }}>
                        {article.content}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Meta Tab */}
              {activeTab === 'meta' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#4F7CFF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>Meta Title</div>
                    <div style={{ fontSize: '14px', color: '#E8EDF8', marginBottom: '8px', lineHeight: '1.5' }}>{article.metaTitle || keyword}</div>
                    <div style={{ fontSize: '11px', color: '#8B949E' }}>{(article.metaTitle || keyword).length} characters (ideal: 50–60)</div>
                  </div>
                  <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#1DB8A0', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>Meta Description</div>
                    <div style={{ fontSize: '14px', color: '#C9D1D9', lineHeight: '1.6', marginBottom: '8px' }}>{article.metaDescription || 'No meta description generated.'}</div>
                    <div style={{ fontSize: '11px', color: article.metaDescription?.length >= 120 && article.metaDescription?.length <= 160 ? '#1DB8A0' : '#F59E0B' }}>
                      {article.metaDescription?.length || 0} characters (ideal: 120–160)
                    </div>
                  </div>
                  <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Google Preview</div>
                    <div style={{ background: '#0D1117', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '18px', color: '#4F7CFF', marginBottom: '4px' }}>{article.metaTitle || keyword}</div>
                      <div style={{ fontSize: '12px', color: '#1DB8A0', marginBottom: '6px' }}>https://yoursite.com/blog/{keyword.replace(/\s+/g, '-').toLowerCase()}</div>
                      <div style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.5' }}>{article.metaDescription || ''}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#21262D" strokeWidth="7" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="7"
                          strokeDasharray="201" strokeDashoffset={201 - (201 * seoScore / 100)} strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: scoreColor }}>{seoScore}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>
                        {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : 'Needs Work'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#8B949E' }}>
                        {seoScore >= 80 ? 'This article is well-optimised for search.' : seoScore >= 60 ? 'A few improvements could boost your ranking.' : 'Consider expanding and adding more keyword usage.'}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>SEO Checklist</div>
                    {seoTips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < seoTips.length - 1 ? '1px solid #21262D' : 'none' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: tip.pass ? 'rgba(29,184,160,0.15)' : 'rgba(226,75,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: tip.pass ? '#1DB8A0' : '#E24B4A' }}>
                          {tip.pass ? '✓' : '✗'}
                        </div>
                        <span style={{ fontSize: '13px', color: tip.pass ? '#C9D1D9' : '#8B949E', flex: 1 }}>{tip.label}</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: tip.pass ? '#1DB8A0' : '#E24B4A' }}>{tip.pass ? 'Pass' : 'Fail'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}