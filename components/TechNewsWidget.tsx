"use client";

import { useEffect, useState } from "react";
import type { NewsItem } from "@/app/api/news/route";

const SOURCE_STYLES: Record<string, { bg: string; text: string }> = {
  "Hacker News":  { bg: "bg-orange-100", text: "text-orange-700" },
  "TechCrunch":   { bg: "bg-emerald-100",text: "text-emerald-700"},
  "The Verge":    { bg: "bg-violet-100", text: "text-violet-700" },
  "Ars Technica": { bg: "bg-rose-100",   text: "text-rose-700"   },
  "TechRadar":    { bg: "bg-sky-100",    text: "text-sky-700"    },
};

function timeAgo(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor(diff / 60000);
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return "just now";
  } catch { return ""; }
}

export default function TechNewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setNews(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="widget-label mb-0">Tech & AI</p>
        <span className="text-xs text-gray-400">🤖 Live</span>
      </div>

      {/* List */}
      <div
        className="flex-1 min-h-0 overflow-y-auto pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
      >
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-2">
                <div className="h-3 w-14 bg-gray-100 rounded-full mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-gray-400 mt-4 text-center">Could not load news.</p>
        )}

        {!loading && !error && (
          <ul className="divide-y divide-gray-50">
            {news.map((item, i) => {
              const style = SOURCE_STYLES[item.source] ?? { bg: "bg-gray-100", text: "text-gray-600" };
              return (
                <li key={i} className="py-2.5 first:pt-0 last:pb-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 group"
                  >
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 h-fit mt-0.5 ${style.bg} ${style.text}`}>
                      {item.source}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.time)}</p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
