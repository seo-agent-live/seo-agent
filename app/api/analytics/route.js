import { NextResponse } from 'next/server';

export async function POST(req) {
  const { url } = await req.json();

  try {
    // Fetch page content via Serper
    const serperRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.SERPER_API_KEY,
      },
      body: JSON.stringify({ q: `site:${url}`, num: 1 }),
    });
    const serperData = await serperRes.json();
    const pageInfo = serperData.organic?.[0] || {};

    const prompt = `Analyze this webpage for SEO:
URL: ${url}
Title: ${pageInfo.title || 'Unknown'}
Description: ${pageInfo.snippet || 'Unknown'}

Provide a JSON response with these exact fields:
- seoScore: number 0-100
- readabilityScore: number 0-100  
- keywordDensity: number 0-10 (percentage)
- issues: array of 4 specific SEO issues found
- recommendations: array of 4 specific recommendations to improve SEO

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

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}