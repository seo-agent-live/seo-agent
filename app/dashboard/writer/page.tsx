'use client';
import { useState, useRef, useEffect, CSSProperties } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'educational', label: 'Educational' },
];

const LENGTHS = [
  { value: 'short', label: 'Short', desc: '500-800 words' },
  { value: 'medium', label: 'Medium', desc: '1,000-1,500 words' },
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

function getSeoScore(content: string, keyword: string) {
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

function getReadTime(content: string) {
  const words = content?.split(/\s+/).length || 0;
  const mins = Math.ceil(words / 200);
  return `${mins} min`;
}

function getWordCount(content: string) {
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
  const [article, setArticle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [activeTab, setActiveTab] = useState('article');
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadSavedArticles();

    const params = new URLSearchParams(window.location.search);
    const keywordParam = params.get('keyword')?.trim() || '';
    const autoGenerateParam = params.get('autoGenerate') === 'true';

    if (keywordParam) {
      setKeyword(keywordParam);
      if (autoGenerateParam) {
        generateArticle(keywordParam);
      }
    }
  }, []);

  const loadSavedArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) {
      setSavedArticles(data);
    }
  };

  const generateArticle = async (overrideKeyword?: string) => {
    const currentKeyword = (overrideKeyword ?? keyword).trim();
    if (!currentKeyword) return;
    if (overrideKeyword) {
      setKeyword(currentKeyword);
    }
    setLoading(true);
    setError(null);
    setArticle(null);
    setEditMode(false);
    setActiveTab('article');
    setSaveSuccess(false);

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
          keyword: currentKeyword,
          tone, length, language, articleType,
          additionalInstructions, includeMetaDesc, includeFAQ, includeConclusion,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setArticle(data);
      setEditedContent(data.content);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    await generateArticle();
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

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);

    const content = editMode ? editedContent : article.content;
    const wordCount = getWordCount(content);
    const seoScore = getSeoScore(content, keyword);

    const slug = keyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : keyword;

    const { error: dbError } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        keyword,
        meta_description: article.metaDescription || '',
        slug,
        word_count: wordCount,
        read_time: getReadTime(content),
        seo_score: seoScore,
        status: 'published',
      });

    if (dbError) {
      console.error('Save error:', dbError);
      setError('Failed to save article. Please try again.');
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadSavedArticles();
    }

    setSaving(false);
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
    { pass: article?.metaDescription?.length >= 120 && article?.metaDescription?.length <= 160, label: 'Meta description is 120-160 chars' },
    { pass: (displayContent?.toLowerCase().split(keyword.toLowerCase()).length || 1) - 1 >= 3, label: 'Keyword used 3+ times' },
    { pass: displayContent?.includes('FAQ') || displayContent?.includes('?'), label: 'Includes FAQ or questions' },
  ] : [];

  const inputStyle: CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#0D1117',
    border: '1px solid #21262D', borderRadius: '8px', color: '#E8EDF8',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
    boxSizing: 'border-box',
  };

  const labelStyle: CSSProperties = {
    fontSize: '11px', fontWeight: '600', color: '#8B949E',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: '8px',
  };

  return (
    <div style={{ padding: '28px', minHeight: '100vh', fontFamily: 'Geist, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8EDF8', margin: 0, marginBottom: '6px' }}>AI Writer</h1>
          <p style={{ fontSize: '13px', color: '#8B949E', margin: 0 }}>Generate long-form, SEO-optimised articles with one keyword.</p>
        </div>
        <button
          onClick={() => setShowSaved(!showSaved)}
          style={{ fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #21262D', background: showSaved ? '#161B22' : 'transparent', color: '#8B949E', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Saved Articles {savedArticles.length > 0 && `(${savedArticles.length})`}
        </button>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div style={{ padding: '12px 20px', background: 'rgba(29,184,160,0.1)', border: '1px solid rgba(29,184,160,0.3)', borderRadius: '10px', color: '#1DB8A0', fontSize: '13px', marginBottom: '16px' }}>
          Article saved successfully! It will persist after refresh.
        </div>
      )}

      {/* Saved Articles Panel */}
      {showSaved && (
        <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>Saved Articles</div>
          {savedArticles.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#8B949E', textAlign: 'center', padding: '20px 0' }}>No saved articles yet.</div>
          ) : savedArticles.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #21262D' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '2px' }}>{a.keyword || a.title}</div>
                <div style={{ fontSize: '11px', color: '#8B949E' }}>
                  {a.word_count} words · SEO {a.seo_score} · {new Date(a.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => window.open('/blog/' + a.slug, '_blank')}
                style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(29,184,160,0.3)', background: 'rgba(29,184,160,0.1)', color: '#1DB8A0', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                View
              </button>
              <button
                onClick={() => {
                  setArticle({ content: a.content, metaDescription: a.meta_description, metaTitle: a.title });
                  setEditedContent(a.content);
                  setShowSaved(false);
                  setKeyword(a.keyword || a.title);
                }}
                style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(79,124,255,0.3)', background: 'rgba(79,124,255,0.1)', color: '#4F7CFF', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Load
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>Target Keyword</div>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder='e.g. "best SEO tools for small business"'
              style={{ ...inputStyle, cursor: 'text' }}
            />
            <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '8px' }}>Press Enter or click Generate</div>
          </div>

          <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '16px' }}>Settings</div>

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
                    border: '1px solid ' + (length === l.value ? 'rgba(79,124,255,0.5)' : '#21262D'),
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

          <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '14px' }}>Include Sections</div>
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

          <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#E8EDF8', marginBottom: '10px' }}>Additional Instructions</div>
            <textarea
              value={additionalInstructions}
              onChange={e => setAdditionalInstructions(e.target.value)}
              placeholder='e.g. "Focus on enterprise customers", "Include statistics"...'
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5', cursor: 'text' }}
            />
          </div>

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
            {loading ? 'Generating...' : 'Generate Article'}
          </button>
        </div>

        {/* RIGHT */}
        <div>
          {error && (
            <div style={{ padding: '16px 20px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '10px', color: '#E24B4A', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>{loadingMsg}</div>
              <div style={{ fontSize: '12px', color: '#8B949E', marginBottom: '24px' }}>Long articles may take up to 30 seconds.</div>
              <div style={{ background: '#21262D', borderRadius: '999px', height: '4px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #4F7CFF, #1DB8A0)', borderRadius: '999px', width: '70%' }} />
              </div>
            </div>
          )}

          {!loading && !article && !error && (
            <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8EDF8', marginBottom: '8px' }}>Ready to write</div>
              <div style={{ fontSize: '13px', color: '#8B949E', maxWidth: '320px', margin: '0 auto', lineHeight: '1.6' }}>
                Enter a keyword on the left and click Generate. Your SEO-optimised article will appear here.
              </div>
            </div>
          )}

          {article && !loading && (
            <div>
              <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '16px 20px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
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
                  <button onClick={() => setEditMode(!editMode)} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: editMode ? 'rgba(29,184,160,0.15)' : 'transparent', border: '1px solid ' + (editMode ? '#1DB8A0' : '#21262D'), color: editMode ? '#1DB8A0' : '#8B949E' }}>
                    {editMode ? 'Editing' : 'Edit'}
                  </button>
                  <button onClick={handleCopy} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: copied ? 'rgba(29,184,160,0.15)' : 'transparent', border: '1px solid ' + (copied ? '#1DB8A0' : '#21262D'), color: copied ? '#1DB8A0' : '#8B949E' }}>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid #21262D', color: '#8B949E' }}>
                    Download
                  </button>
                  <button onClick={handleSave} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(79,124,255,0.15)', border: '1px solid rgba(79,124,255,0.4)', color: '#4F7CFF' }}>
                    {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[
                  { key: 'article', label: 'Article' },
                  { key: 'meta', label: 'Meta' },
                  { key: 'seo', label: 'SEO Analysis' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'inherit',
                    background: activeTab === tab.key ? '#161B22' : 'transparent',
                    border: '1px solid ' + (activeTab === tab.key ? '#21262D' : 'transparent'),
                    color: activeTab === tab.key ? '#E8EDF8' : '#8B949E',
                  }}>{tab.label}</button>
                ))}
              </div>

              {activeTab === 'article' && (
                <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', overflow: 'hidden' }}>
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

              {activeTab === 'meta' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#4F7CFF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>Meta Title</div>
                    <div style={{ fontSize: '14px', color: '#E8EDF8', marginBottom: '8px', lineHeight: '1.5' }}>{article.metaTitle || keyword}</div>
                    <div style={{ fontSize: '11px', color: '#8B949E' }}>{(article.metaTitle || keyword).length} characters (ideal: 50-60)</div>
                  </div>
                  <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#1DB8A0', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>Meta Description</div>
                    <div style={{ fontSize: '14px', color: '#C9D1D9', lineHeight: '1.6', marginBottom: '8px' }}>{article.metaDescription || 'No meta description generated.'}</div>
                    <div style={{ fontSize: '11px', color: article.metaDescription?.length >= 120 && article.metaDescription?.length <= 160 ? '#1DB8A0' : '#F59E0B' }}>
                      {article.metaDescription?.length || 0} characters (ideal: 120-160)
                    </div>
                  </div>
                  <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Google Preview</div>
                    <div style={{ background: '#0D1117', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '18px', color: '#4F7CFF', marginBottom: '4px' }}>{article.metaTitle || keyword}</div>
                      <div style={{ fontSize: '12px', color: '#1DB8A0', marginBottom: '6px' }}>
                        {'https://yoursite.com/blog/' + keyword.replace(/\s+/g, '-').toLowerCase()}
                      </div>
                      <div style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.5' }}>{article.metaDescription || ''}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                  <div style={{ background: 'rgba(22,27,34,0.65)', border: '1px solid #21262D', borderRadius: '12px', padding: '20px' }}>
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

