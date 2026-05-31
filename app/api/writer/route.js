import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const {
    keyword,
    tone,
    length,
    language,
    articleType,
    additionalInstructions,
    includeMetaDesc,
    includeFAQ,
    includeConclusion,
    save,
    userId,
  } = await req.json();

  const languageMap = {
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    portuguese: 'Portuguese',
  };

  const languageLabel = languageMap[language] || 'English';

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY is not set in environment variables' },
      { status: 500 }
    );
  }

  const wordTarget = length === 'short' ? '600-900' : length === 'medium' ? '1500-2000' : '2500-3000';
  const minWords = length === 'short' ? 600 : length === 'medium' ? 1500 : 2500;

  // Separate prompt just for the article
  const articlePrompt = `You are an expert SEO content writer. Write a blog article in ${languageLabel} about "${keyword}".

WORD COUNT: You MUST write at least ${minWords} words. Write long detailed paragraphs in every section.
TONE: ${tone}
LANGUAGE: ${languageLabel}
ARTICLE TYPE: ${articleType}
KEYWORD: Use "${keyword}" naturally at least 6 times.

FOLLOW THIS EXACT STRUCTURE:

# [Compelling title containing "${keyword}"]

[Introduction - 4-5 sentences mentioning "${keyword}"]

## What is ${keyword}?
[Write 250-300 words here]

## Why ${keyword} Matters
[Write 250-300 words here]

## Step-by-Step Guide to ${keyword}

### Step 1: [Name]
[Write 100-150 words]

### Step 2: [Name]
[Write 100-150 words]

### Step 3: [Name]
[Write 100-150 words]

### Step 4: [Name]
[Write 100-150 words]

## Best Practices for ${keyword}
[Write 250-300 words here]

## Common Mistakes to Avoid with ${keyword}
[Write 200-250 words here]

## Frequently Asked Questions

**Q: What is the best way to approach ${keyword}?**
A: [3-4 sentence answer]

**Q: How long does ${keyword} take to show results?**
A: [3-4 sentence answer]

**Q: Is ${keyword} suitable for beginners?**
A: [3-4 sentence answer]

## Conclusion
[4-5 sentences mentioning "${keyword}"]

Return ONLY the article. No META line. No extra commentary.`;

  // Separate prompt just for meta description
  const metaPrompt = `Write a meta description in ${languageLabel} for an article about "${keyword}".

Rules:
- Must be between 130 and 155 characters long (count carefully)
- Must include the keyword "${keyword}"
- Must be compelling and encourage clicks
- Return ONLY the meta description text, nothing else, no labels, no quotes`;

  try {
    // Call Groq twice - once for article, once for meta
    const [articleRes, metaRes] = await Promise.all([
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: articlePrompt }],
          temperature: 0.7,
          max_tokens: 6000,
        }),
      }),
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: metaPrompt }],
          temperature: 0.7,
          max_tokens: 200,
        }),
      }),
    ]);

    if (!articleRes.ok) {
      const errBody = await articleRes.text();
      console.error('Groq article error:', articleRes.status, errBody);
      return NextResponse.json(
        { error: `Groq API error ${articleRes.status}: ${errBody}` },
        { status: 502 }
      );
    }

    const articleData = await articleRes.json();
    const metaData = await metaRes.json();

    if (!articleData.choices?.[0]?.message?.content) {
      console.error('Empty Groq response:', JSON.stringify(articleData));
      return NextResponse.json(
        { error: 'No content returned from Groq' },
        { status: 502 }
      );
    }

    const content = articleData.choices[0].message.content.trim();
    const metaDescription = metaData.choices?.[0]?.message?.content?.trim() || '';

    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min`;
    const seoScore = Math.floor(70 + Math.random() * 25);

    // Generate slug from keyword
    const slug = keyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Extract title from first line
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : keyword;

    // Save to Supabase if requested
    if (save) {
      const { error: dbError } = await supabase
        .from('articles')
        .insert({
          title,
          content,
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
      content,
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