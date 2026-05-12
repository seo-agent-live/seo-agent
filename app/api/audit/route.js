import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { url, userId } = await req.json();

  try {
    // Fetch page data via Serper
    const serperRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.SERPER_API_KEY,
      },
      body: JSON.stringify({ q: `site:${url}`, num: 5 }),
    });
    const serperData = await serperRes.json();
    const pageInfo = serperData.organic?.[0] || {};

    const prompt = `You are an SEO expert. Perform a comprehensive audit for this URL: ${url}
Page title found: ${pageInfo.title || 'Not found'}
Meta description found: ${pageInfo.snippet || 'Not found'}

Return a JSON object with these exact fields:
- overallScore: number 0-100
- metaScore: number 0-100
- performanceScore: number 0-100
- metaTags: object with keys: title, description, h1, canonical, robots (each as string)
- issues: array of 6 specific SEO issues
- recommendations: array of 6 specific recommendations

Return ONLY valid JSON, no other text.`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    // Save to Supabase
    await supabase.from('audit_results').insert({
      url,
      score: parsed.overallScore,
      issues: parsed.issues,
      recommendations: parsed.recommendations,
      meta_tags: parsed.metaTags,
    });

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}