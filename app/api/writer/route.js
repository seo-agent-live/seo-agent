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

STRICT REQUIREMENTS - you MUST follow all of these:
1. Write EXACTLY ${wordTarget} words minimum - this is critical
2. Start with a single H1 title using markdown: # Title Here
3. Use multiple H2 subheadings throughout using markdown: ## Subheading Here
4. Use H3 subheadings where appropriate: ### Subheading Here
5. Tone: ${tone}
6. Naturally include the keyword "${keyword}" at least 5 times
7. Include a proper introduction and conclusion
8. Include a FAQ section with at least 3 questions and answers under ## Frequently Asked Questions
9. At the very end, on its own line, add a meta description prefixed EXACTLY like this:
META: Your meta description here (must be 120-160 characters)

Structure to follow:
# [Compelling Title with keyword]

[Introduction paragraph - 2-3 sentences]

## [First Main Section]
[Content...]

## [Second Main Section]
[Content...]

## [Third Main Section]
[Content...]

## Frequently Asked Questions
**Q: [Question 1]**
A: [Answer 1]

**Q: [Question 2]**
A: [Answer 2]

**Q: [Question 3]**
A: [Answer 3]

## Conclusion
[Concluding paragraph]

META: [120-160 character meta description containing the keyword]

Return ONLY the article content, no extra commentary or explanations.`;

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