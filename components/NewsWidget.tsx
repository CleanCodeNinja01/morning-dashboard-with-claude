"use client";

import { useEffect, useState } from "react";
import type { NewsItem } from "@/app/api/news/route";

const SOURCE_COLORS: Record<string, string> = {
  "Hacker News": "bg-orange-100 text-orange-600",
  "TechCrunch": "bg-green-100 text-green-700",
  "The Verge": "bg-purple-100 text-purple-600",
  "Ars Technica": "bg-red-100 text-red-600",
  "TechRadar": "bg-blue-100 text-blue-600",
};

function timeAgo(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor(diff / 60000);
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return "just now";
  } catch {
    return "";
  }
}

export default function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card col-span-2">
      <div className="flex items-center justify-between mb-4">
        <p className="widget-label">Tech News</p>
        <span className="text-xs text-gray-400">Live</span>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="h-3 bg-gray-100 rounded w-16 flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-gray-400">Could not load news. Check your connection.</p>
      )}

      {!loading && !error && (
        <ul className="divide-y divide-gray-50">
          {news.map((item, i) => (
            <li key={i} className="py-3 first:pt-0 last:pb-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group"
              >
                <span
                  className={`mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 h-fit ${
                    SOURCE_COLORS[item.source] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.source}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.time)}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
