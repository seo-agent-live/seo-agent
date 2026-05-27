import { NextResponse } from 'next/server';

const TEMPLATES = [
  { id: 'blog-post', name: 'Blog Post', category: 'Blog Post', icon: '✍️', description: 'Write an engaging blog post optimised for SEO.', estimatedTime: '2 min', placeholder: 'e.g. "10 tips for remote work productivity"' },
  { id: 'landing-page', name: 'Landing Page', category: 'Landing Page', icon: '🚀', description: 'High-converting landing page copy with CTA.', estimatedTime: '3 min', placeholder: 'e.g. "SaaS project management tool"' },
  { id: 'product-review', name: 'Product Review', category: 'Product Review', icon: '⭐', description: 'Detailed product review that ranks on Google.', estimatedTime: '2 min', placeholder: 'e.g. "Notion vs Obsidian"' },
  { id: 'how-to-guide', name: 'How-To Guide', category: 'How-To Guide', icon: '📋', description: 'Step-by-step guide that answers search intent.', estimatedTime: '2 min', placeholder: 'e.g. "How to set up Google Search Console"' },
  { id: 'listicle', name: 'Listicle', category: 'Listicle', icon: '📝', description: 'Numbered list article designed to rank and get clicks.', estimatedTime: '2 min', placeholder: 'e.g. "Best free SEO tools 2025"' },
  { id: 'case-study', name: 'Case Study', category: 'Case Study', icon: '📊', description: 'Compelling case study with results and insights.', estimatedTime: '3 min', placeholder: 'e.g. "How we grew organic traffic 300%"' },
  { id: 'email', name: 'Email Newsletter', category: 'Email', icon: '📧', description: 'Engaging email newsletter your subscribers will love.', estimatedTime: '1 min', placeholder: 'e.g. "Weekly SEO tips for founders"' },
  { id: 'comparison', name: 'Comparison Article', category: 'Blog Post', icon: '⚖️', description: 'Side-by-side comparison article that converts readers.', estimatedTime: '2 min', placeholder: 'e.g. "Ahrefs vs SEMrush vs Moz"' },
];

export async function GET() {
  return NextResponse.json({ templates: TEMPLATES });
}

export async function POST(req) {
  const { templateId, topic } = await req.json();
  const template = TEMPLATES.find(t => t.id === templateId);

  const prompt = `You are an expert content writer. Write a ${template?.name || 'article'} about: "${topic}".
Make it SEO-optimised, engaging, and well-structured with proper headings.
Write at least 600 words. Use markdown formatting.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}