import { NextResponse } from 'next/server';

/**
 * Google Search Console API route
 *
 * To activate:
 * 1. Go to https://console.cloud.google.com → Enable "Google Search Console API"
 * 2. Create OAuth 2.0 credentials (Web application)
 * 3. Add to .env:
 *      GOOGLE_CLIENT_ID=...
 *      GOOGLE_CLIENT_SECRET=...
 *      GOOGLE_REFRESH_TOKEN=...   ← get this via OAuth playground
 *      GSC_SITE_URL=https://seo-agent-tau-eight.vercel.app
 * 4. Uncomment the implementation below
 */

export async function GET() {
  const isConfigured =
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GSC_SITE_URL;

  if (!isConfigured) {
    return NextResponse.json({ connected: false });
  }

  try {
    // Step 1: Get a fresh access token using the refresh token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
    });
    const { access_token } = await tokenRes.json();

    // Step 2: Query GSC for last 28 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 28);

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const gscRes = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
        process.env.GSC_SITE_URL!
      )}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: [],
        }),
      }
    );

    const gscData = await gscRes.json();
    const row = gscData.rows?.[0];

    return NextResponse.json({
      connected: true,
      clicks: Math.round(row?.clicks ?? 0),
      impressions: Math.round(row?.impressions ?? 0),
      ctr: row?.ctr ?? 0,
      position: row?.position ?? 0,
    });
  } catch (err) {
    console.error('GSC error:', err);
    return NextResponse.json({ connected: false });
  }
}