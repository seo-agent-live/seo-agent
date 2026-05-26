import { NextResponse } from 'next/server';

export async function POST(req) {
  const { query, mode } = await req.json();

  try {
    // Fetch from Serper
    const serperRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.SERPER_API_KEY,
      },
      body: JSON.stringify({ q: query, num: 10 }),
    });
    const serperData = await serperRes.json();
    if (!serperRes.ok) {
      const message = serperData?.error?.message || serperData?.error || serperData?.message || `Serper error ${serperRes.status}`;
      throw new Error(message);
    }
    const topPages = (serperData.organic || []).slice(0, 5).map(r => ({
      title: r.title,
      domain: r.link?.split('/')[2] || '',
      snippet: r.snippet,
    }));

    // Build prompt for GROQ
    const topPagesSummary = topPages.map((p, i) => `${i + 1}. ${p.title} (${p.domain}): ${p.snippet}`).join('\n');

    let prompt = '';
    if (mode === 'keywords') {
      prompt = `Based on the keyword "${query}" and these top ranking pages:\n${topPagesSummary}\n\nGenerate 10 related keyword ideas. For each keyword return JSON with fields: keyword, intent (Informational/Commercial/Transactional), difficulty (Low/Medium/High). Return ONLY a JSON array, no other text.`;
    } else if (mode === 'competitors') {
      prompt = `Analyze these top ranking pages for "${query}":\n${topPagesSummary}\n\nProvide a detailed competitor analysis covering: content strategy, common topics, content gaps, and opportunities. Return JSON with fields: analysis (string). Return ONLY JSON, no other text.`;
    } else if (mode === 'gaps') {
      prompt = `Based on the search results for "${query}":\n${topPagesSummary}\n\nIdentify 8 content gap opportunities that are not well covered. For each return JSON with fields: topic, opportunity, priority (High/Medium/Low). Return ONLY a JSON array, no other text.`;
    }

    // Call GROQ
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });
    const groqData = await groqRes.json();
    if (!groqRes.ok) {
      const message = groqData?.error?.message || groqData?.error || groqData?.message || `GROQ error ${groqRes.status}`;
      throw new Error(message);
    }

    const text = groqData.choices?.[0]?.message?.content || groqData.choices?.[0]?.text || '[]';
    const clean = String(text).replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseError) {
      parsed = clean;
    }

    if (mode === 'keywords') {
      if (Array.isArray(parsed)) return NextResponse.json({ keywords: parsed, topPages });
      if (parsed?.keywords) return NextResponse.json({ keywords: parsed.keywords, topPages });
      throw new Error('Unable to parse keyword results from AI response.');
    }

    if (mode === 'competitors') {
      let analysis = '';
      if (typeof parsed === 'string') {
        analysis = parsed;
      } else if (Array.isArray(parsed)) {
        analysis = parsed[0]?.analysis || JSON.stringify(parsed);
      } else {
        analysis = parsed?.analysis || JSON.stringify(parsed);
      }
      return NextResponse.json({ analysis, topPages });
    }

    if (mode === 'gaps') {
      if (Array.isArray(parsed)) return NextResponse.json({ gaps: parsed, topPages });
      if (parsed?.gaps) return NextResponse.json({ gaps: parsed.gaps, topPages });
      throw new Error('Unable to parse content gap results from AI response.');
    }

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}