import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { keyword, tone, length, save, userId } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY is not set in environment variables' },
      { status: 500 }
    );
  }

  const wordTarget = length === 'short' ? '500-800' : length === 'medium' ? '1000-1500' : '2000-2500';
  const minWords = length === 'short' ? 500 : length === 'medium' ? 1000 : 2000;

  const prompt = `You are an expert SEO content writer. Write a blog article about "${keyword}".

MOST IMPORTANT RULES - READ CAREFULLY:
1. WORD COUNT: You MUST write at least ${minWords} words. This is non-negotiable. Write long, detailed paragraphs.
2. KEYWORD: You MUST use the exact phrase "${keyword}" at least 6 times naturally throughout the article.
3. META DESCRIPTION: Must be EXACTLY between 120-155 characters. Count every character carefully before writing it.
4. TONE: Write in a ${tone} tone throughout.

FOLLOW THIS EXACT STRUCTURE AND WRITE LOTS OF CONTENT IN EACH SECTION:

# [Compelling title containing "${keyword}"]

[Introduction - write 4-5 sentences mentioning "${keyword}" and what the article covers]

## What is ${keyword}?
[Write 250-300 words explaining this topic in detail. Mention "${keyword}" naturally.]

## Why ${keyword} Matters in 2024
[Write 250-300 words on why this topic is important. Include specific reasons and examples.]

## Step-by-Step Guide to ${keyword}
[Write 300-400 words with detailed steps. Mention "${keyword}" at least once here.]

### Step 1: [Name]
[Write 80-100 words]

### Step 2: [Name]
[Write 80-100 words]

### Step 3: [Name]
[Write 80-100 words]

## Best Practices for ${keyword}
[Write 250-300 words covering tips and best practices. Mention "${keyword}" naturally.]

## Common Mistakes to Avoid
[Write 200-250 words on mistakes people make related to "${keyword}"]

## Frequently Asked Questions

**Q: What is the best way to approach ${keyword}?**
A: [Write 3-4 sentences with a detailed answer]

**Q: How long does ${keyword} take to show results?**
A: [Write 3-4 sentences with a detailed answer]

**Q: Is ${keyword} suitable for beginners?**
A: [Write 3-4 sentences with a detailed answer]

## Conclusion
[Write 4-5 sentences summarising the article and mentioning "${keyword}" one final time]

META: [Your meta description here - must be between 120 and 155 characters including spaces, must contain "${keyword}"]

FINAL CHECKLIST BEFORE RESPONDING:
- Did you write at least ${minWords} words? If not, go back and expand each section.
- Did you use "${keyword}" at least 6 times? If not, add it to more sections.
- Is your META line between 120-155 characters? Count it carefully.
- Only return the article content, nothing else.`;

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

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error('Groq error:', groqRes.status, errBody);
      return NextResponse.json(
        { error: `Groq API error ${groqRes.status}: ${errBody}` },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();

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

    // Generate slug from keyword
    const slug = keyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Extract title from first line
    const titleMatch = cleanContent.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : keyword;

    // Save to Supabase if requested
    if (save) {
      const { error: dbError } = await supabase
        .from('articles')
        .insert({
          title,
          content: cleanContent,
          keyword,
          meta_description: metaDescription,
          slug,
          word_count: wordCount,
          read_time: readTime,
          seo_score: seoScore,
          status: 'published',
          user_id: userId || null,
        });

      if (dbError) {
        console.error('Supabase save error:', dbError);
      }
    }

    return NextResponse.json({
      content: cleanContent,
      metaDescription,
      wordCount,
      readTime,
      seoScore,
      slug,
      title,
    });

  } catch (err) {
    console.error('Writer route exception:', err);
    return NextResponse.json(
      { error: `Unexpected error: ${err.message}` },
      { status: 500 }
    );
  }
}