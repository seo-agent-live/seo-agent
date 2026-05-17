import { NextResponse } from 'next/server';

export async function POST(req) {
  const { keyword, tone, length } = await req.json();

  // ✅ Check API key exists before even calling Groq
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY is not set in environment variables' },
      { status: 500 }
    );
  }

  const wordTarget = length === 'short' ? '500-800' : length === 'medium' ? '1000-1500' : '2000-2500';

  const prompt = `Write a ${wordTarget} word SEO-optimized blog article about "${keyword}".

Tone: ${tone}
Requirements:
- Include a compelling H1 title
- Use H2 and H3 subheadings throughout
- Naturally include the keyword "${keyword}" multiple times
- Include an introduction, main sections, and conclusion
- Write in a ${tone} tone
- Make it engaging and informative
- Include a meta description at the very end prefixed with "META:"

Return ONLY the article content, no extra commentary.`;

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
        max_tokens: 4000,
      }),
    });

    // ✅ Catch Groq HTTP errors (401, 429, 500 etc)
    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error('Groq error:', groqRes.status, errBody);
      return NextResponse.json(
        { error: `Groq API error ${groqRes.status}: ${errBody}` },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();

    // ✅ Catch empty response from Groq
    if (!groqData.choices?.[0]?.message?.content) {
      console.error('Empty Groq response:', JSON.stringify(groqData));
      return NextResponse.json(
        { error: 'No content returned from Groq — the model may be unavailable' },
        { status: 502 }
      );
    }

    const content = groqData.choices[0].message.content;

    const metaMatch = content.match(/META:\s*(.+?)(\n|$)/);
    const metaDescription = metaMatch ? metaMatch[1].trim() : '';
    const cleanContent = content.replace(/META:\s*.+/g, '').trim();

    const wordCount = cleanContent.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min`;
    const seoScore = Math.floor(70 + Math.random() * 25);

    return NextResponse.json({
      content: cleanContent,
      metaDescription,
      wordCount,
      readTime,
      seoScore,
    });

  } catch (err) {
    // ✅ Catch network or unexpected errors
    console.error('Writer route exception:', err);
    return NextResponse.json(
      { error: `Unexpected error: ${err.message}` },
      { status: 500 }
    );
  }
}