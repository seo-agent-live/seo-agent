import { NextResponse } from 'next/server';

export async function POST(req) {
  const { product, benefit, audience, cta, tone } = await req.json();

  const prompt = `Create a high-converting landing page for:
Product: ${product}
Main Benefit: ${benefit}
Target Audience: ${audience || 'general audience'}
CTA: ${cta || 'Get Started'}
Tone: ${tone}

Return a JSON object with:
- copy: full landing page copy as text (headline, subheadline, benefits, social proof, CTA)
- html: complete single-file HTML landing page with inline CSS styling, dark modern design

Return ONLY valid JSON, no other text.`;

  try {
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
        max_tokens: 4000,
      }),
    });

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}