import { NextResponse } from "next/server";

export interface QuoteResponse {
  text: string;
  author: string;
}

export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/today", {
      headers: { "User-Agent": "MorningDashboard/1.0" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error("ZenQuotes API request failed");

    const data = await res.json();
    const quote = data[0];

    if (!quote?.q) throw new Error("No quote returned");

    return NextResponse.json({
      text: quote.q,
      author: quote.a,
    } satisfies QuoteResponse);
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}
