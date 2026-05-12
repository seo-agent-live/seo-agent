import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// POST /api/keywords/suggestions
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: `You are an expert SEO keyword researcher. Given a topic, return exactly 10 keyword suggestions as a JSON array. Each item must have:
- "keyword": the keyword phrase (2-5 words, lowercase)
- "intent": one of "informational", "commercial", "navigational", "transactional"

Return ONLY valid JSON array, no markdown, no explanation. Example:
[{"keyword":"best seo tools 2025","intent":"commercial"},...]`,
          },
          {
            role: 'user',
            content: `Generate 10 SEO keyword suggestions for the topic: "${topic}"`,
          },
        ],
      }),
    });

    const groqData = await res.json();
    const raw = groqData.choices?.[0]?.message?.content ?? '[]';

    // Clean and parse
    const clean = raw.replace(/```json|```/g, '').trim();
    let suggestions = [];
    try {
      suggestions = JSON.parse(clean);
    } catch {
      // Try to extract JSON array from response
      const match = clean.match(/\[[\s\S]*\]/);
      if (match) suggestions = JSON.parse(match[0]);
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
  } catch (e) {
    console.error('Suggestions error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}