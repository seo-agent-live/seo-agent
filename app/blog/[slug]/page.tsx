import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published')
    .single();

  if (error || !article) {
    notFound();
  }

  const htmlContent = article.content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<h[123]>)(.+)$/gm, '<p>$1</p>');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#666' }}>
        <span>{article.word_count} words</span>
        <span style={{ margin: '0 8px' }}>·</span>
        <span>{article.read_time} read</span>
        <span style={{ margin: '0 8px' }}>·</span>
        <span>SEO Score: {article.seo_score}</span>
      </div>
      <div
        style={{ lineHeight: '1.8', fontSize: '18px' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {article.meta_description && (
        <div style={{ marginTop: '40px', padding: '16px', background: '#f5f5f5', borderRadius: '8px', fontSize: '14px', color: '#666' }}>
          <strong>Meta Description:</strong> {article.meta_description}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_description')
    .eq('slug', params.slug)
    .single();

  return {
    title: article?.title || 'Blog Post',
    description: article?.meta_description || '',
  };
}