import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// POST /api/clusters/generate — AI generates clusters for a topic
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    // Ask GROQ to generate keyword clusters
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        max_tokens: 1200,
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content: `You are an expert SEO strategist specializing in topic clusters. 
Given a topic, generate 4-5 keyword clusters. Each cluster should have:
- A clear pillar/hub name
- 5-8 supporting keywords

Return ONLY a valid JSON array like this:
[
  {
    "name": "Cluster Name",
    "keywords": [
      {"keyword": "keyword phrase", "intent": "informational"},
      {"keyword": "another keyword", "intent": "commercial"}
    ]
  }
]
Intent must be one of: informational, commercial, navigational, transactional.
No markdown, no explanation, only valid JSON.`,
          },
          {
            role: 'user',
            content: `Generate keyword clusters for the topic: "${topic}"`,
          },
        ],
      }),
    });

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content ?? '[]';

    // Parse JSON safely
    let clusterDefs = [];
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      clusterDefs = JSON.parse(clean);
    } catch {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) clusterDefs = JSON.parse(match[0]);
    }

    if (!Array.isArray(clusterDefs) || clusterDefs.length === 0) {
      throw new Error('AI did not return valid clusters');
    }

    // Save all clusters to Supabase
    const supabase = getSupabase();
    const savedClusters = [];

    for (const def of clusterDefs) {
      // Insert cluster
      const { data: cluster, error: clusterErr } = await supabase
        .from('clusters')
        .insert({ user_id: userId, name: def.name })
        .select()
        .single();

      if (clusterErr) continue;

      // Insert keywords
      const keywordRows = (def.keywords ?? []).map(kw => ({
        cluster_id: cluster.id,
        user_id: userId,
        keyword: typeof kw === 'string' ? kw : kw.keyword,
        intent: kw.intent ?? null,
      }));

      const { data: kws } = await supabase
        .from('cluster_keywords')
        .insert(keywordRows)
        .select();

      savedClusters.push({ ...cluster, keywords: kws ?? [] });
    }

    return NextResponse.json({ clusters: savedClusters });
  } catch (e) {
    console.error('Cluster generation error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}