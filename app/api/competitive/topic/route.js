import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function extractDomain(url) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch {
    return url.replace('www.', '').split('/')[0];
  }
}

async function serperSearch(query) {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query, gl: 'us', hl: 'en', num: 10 }),
  });
  return res.json();
}

async function groqTopicInsights(topic, serpResults, competitors) {
  const topDomains = serpResults.slice(0, 5).map(r => extractDomain(r.link ?? '')).join(', ');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      max_tokens: 700,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO strategist. Give concise, actionable competitive insights.',
        },
        {
          role: 'user',
          content: `Topic: "${topic}"
Top SERP domains: ${topDomains}
User's tracked competitors: ${competitors.join(', ') || 'none specified'}

Analyze:
1. Who dominates this topic and why
2. Content gaps and opportunities
3. How to rank in the top 3 for this topic
Keep it under 5 sentences, very actionable.`,
        },
      ],
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// POST /api/competitive/topic
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic, competitors = [] } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    // SERPER search for this topic
    const serperData = await serperSearch(topic);
    const organic = serperData.organic ?? [];

    const serpResults = organic.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet,
    }));

    // Build competitor breakdown
    const competitorBreakdown = competitors
      .filter(c => c?.trim())
      .map(c => {
        const domain = extractDomain(c);
        const positions = organic
          .map((r, i) => ({ domain: extractDomain(r.link ?? ''), pos: i + 1 }))
          .filter(r => r.domain.includes(domain))
          .map(r => r.pos);
        return { domain, positions, presence: positions.length };
      });

    // Also add top organic domains not in user's list
    const topOrganicDomains = [...new Set(organic.slice(0, 5).map(r => extractDomain(r.link ?? '')))]
      .filter(d => !competitors.some(c => extractDomain(c).includes(d)))
      .slice(0, 3)
      .map((domain, i) => ({
        domain,
        positions: [i + 1],
        presence: 1,
      }));

    const allCompetitors = [...competitorBreakdown, ...topOrganicDomains];

    // AI insights
    const aiInsights = await groqTopicInsights(topic, organic, competitors);

    const result = { topic, serpResults, competitorBreakdown: allCompetitors, aiInsights };

    // Save to Supabase
    const supabase = getSupabase();
    await supabase.from('competitive_analyses').insert({
      user_id: userId,
      type: 'topic',
      title: topic,
      result_data: result,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error('Topic analysis error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}