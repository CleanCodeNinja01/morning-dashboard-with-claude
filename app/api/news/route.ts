import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  time: string;
}

const RSS_FEEDS = [
  { url: "https://techcrunch.com/feed/", source: "TechCrunch" },
  { url: "https://www.theverge.com/rss/index.xml", source: "The Verge" },
  { url: "https://feeds.arstechnica.com/arstechnica/index", source: "Ars Technica" },
  { url: "https://www.techradar.com/rss", source: "TechRadar" },
];

async function fetchHackerNews(): Promise<NewsItem[]> {
  try {
    const ids: number[] = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    ).then((r) => r.json());

    const top5 = ids.slice(0, 5);
    const items = await Promise.all(
      top5.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) =>
          r.json()
        )
      )
    );

    return items
      .filter((item) => item?.url)
      .map((item) => ({
        title: item.title,
        url: item.url,
        source: "Hacker News",
        time: new Date(item.time * 1000).toISOString(),
      }));
  } catch {
    return [];
  }
}

async function fetchRss(feedUrl: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "MorningDashboard/1.0" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    // Handle both RSS 2.0 and Atom
    const channel = parsed?.rss?.channel || parsed?.feed;
    const rawItems: any[] = channel?.item || channel?.entry || [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items.slice(0, 3).map((item) => ({
      title: item.title?.["#text"] ?? item.title ?? "Untitled",
      url: item.link?.["@_href"] ?? item.link ?? item.guid ?? "#",
      source,
      time: item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const [hn, ...rssResults] = await Promise.all([
    fetchHackerNews(),
    ...RSS_FEEDS.map((f) => fetchRss(f.url, f.source)),
  ]);

  const all: NewsItem[] = [hn, ...rssResults].flat();

  // Sort by time descending, take top 12
  const sorted = all
    .filter((item) => item.title && item.url)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 12);

  return NextResponse.json(sorted);
}
