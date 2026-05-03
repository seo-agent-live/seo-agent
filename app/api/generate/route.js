import { NextResponse } from "next/server";

const SERPER_URL = "https://google.serper.dev/search";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return NextResponse.json(
        { error: "A valid keyword is required." },
        { status: 400 }
      );
    }

    if (!process.env.SERPER_API_KEY || !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing API keys in environment variables." },
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
    const topResults = (serperData.organic || []).slice(0, 5).map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));

    const prompt = `
Keyword: ${keyword.trim()}

Top Google Results:
${topResults
  .map(
    (item, index) =>
      `${index + 1}. Title: ${item.title}\nURL: ${item.link}\nSnippet: ${item.snippet}`
  )
  .join("\n\n")}

Write a complete, high-quality SEO article based on the keyword and competitor landscape above.

Requirements:
- Start with a compelling title (H1 style).
- Add a short meta description.
- Use clear section headings and subheadings.
- Include an introduction, detailed body, and conclusion.
- Keep it informative, engaging, and practical.
- Include FAQ section at the end (3-5 questions).
- Use natural keyword placement and semantic relevance.
- Minimum 1200 words.
`;

    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are an expert SEO content writer. Produce detailed, structured, and original content in Markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return NextResponse.json(
        { error: `Groq API error: ${errorText || groqResponse.status}` },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const article = groqData?.choices?.[0]?.message?.content || "";

    if (!article) {
      return NextResponse.json(
        { error: "Groq returned an empty article." },
        { status: 502 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
