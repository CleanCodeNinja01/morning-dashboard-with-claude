import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export interface WorldNewsItem {
  title: string;
  url: string;
  source: string;
  time: string;
}

const WORLD_FEEDS = [
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", source: "BBC" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", source: "Al Jazeera" },
  { url: "https://www.dawn.com/feeds/home", source: "Dawn" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", source: "NY Times" },
];

async function fetchFeed(feedUrl: string, source: string): Promise<WorldNewsItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "MorningDashboard/1.0" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const channel = parsed?.rss?.channel || parsed?.feed;
    const rawItems: any[] = channel?.item || channel?.entry || [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items.slice(0, 4).map((item) => ({
      title: item.title?.["#text"] ?? item.title ?? "Untitled",
      url: item.link?.["@_href"] ?? item.link ?? item.guid?.["#text"] ?? item.guid ?? "#",
      source,
      time: item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const results = await Promise.all(
    WORLD_FEEDS.map((f) => fetchFeed(f.url, f.source))
  );

  const all = results
    .flat()
    .filter((item) => item.title && item.url && item.url !== "#")
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 14);

  return NextResponse.json(all);
}
