import { NextResponse } from 'next/server';

export async function POST(req) {
  const { title, content, wpConfig } = await req.json();
  try {
    const credentials = btoa(`${wpConfig.username}:${wpConfig.password}`);
    const res = await fetch(`${wpConfig.url}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        title,
        content,
        status: 'publish',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'WordPress publish failed');
    return NextResponse.json({ success: true, url: data.link });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}