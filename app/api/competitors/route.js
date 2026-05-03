import { NextResponse } from "next/server";

const SERPER_URL = "https://google.serper.dev/search";

export async function POST(request) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return NextResponse.json({ error: "A valid keyword is required." }, { status: 400 });
    }

    if (!process.env.SERPER_API_KEY) {
      return NextResponse.json(
        { error: "Missing SERPER_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const serperResponse = await fetch(SERPER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.SERPER_API_KEY,
      },
      body: JSON.stringify({
        q: keyword.trim(),
        num: 5,
      }),
    });

    if (!serperResponse.ok) {
      const errorText = await serperResponse.text();
      return NextResponse.json(
        { error: `Serper API error: ${errorText || serperResponse.status}` },
        { status: 502 }
      );
    }

    const serperData = await serperResponse.json();
    const organic = Array.isArray(serperData.organic) ? serperData.organic : [];
    const topResults = organic.slice(0, 5).map((result) => ({
      title: result.title || "",
      link: result.link || "",
      snippet: result.snippet || "",
      position: result.position,
    }));

    return NextResponse.json({ results: topResults });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error." }, { status: 500 });
  }
}
