import { NextResponse } from 'next/server';
export async function POST(req) {
  const { type, config } = await req.json();
  try {
    if (type === 'wordpress') {
      const credentials = btoa(`${config.username}:${config.password}`);
      const res = await fetch(`${config.url}/wp-json/wp/v2/users/me`, {
        headers: { 'Authorization': `Basic ${credentials}` },
      });
      if (!res.ok) throw new Error('WordPress connection failed. Check your credentials.');
      return NextResponse.json({ success: true, message: 'WordPress connected successfully!' });
    }
    if (type === 'webflow') {
      const res = await fetch('https://api.webflow.com/sites', {
        headers: { 'Authorization': `Bearer ${config.apiKey}`, 'accept-version': '1.0.0' },
      });
      if (!res.ok) throw new Error('Webflow connection failed. Check your API key.');
      return NextResponse.json({ success: true, message: 'Webflow connected successfully!' });
    }
    if (type === 'google_search_console') {
      return NextResponse.json({ success: true, message: 'Google Search Console settings saved. Full OAuth setup required for live data.' });
    }
    return NextResponse.json({ success: false, message: 'Unknown integration type.' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}