"use client";

import { useEffect, useState } from "react";
import type { QuoteResponse } from "@/app/api/quote/route";

export default function QuoteWidget() {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((data) => {
        if (data.text) setQuote(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="card bg-indigo-50 border border-indigo-100">
      <p className="widget-label text-indigo-400">Daily Inspiration</p>
      {quote ? (
        <blockquote className="mt-2">
          <p className="text-gray-800 text-base leading-relaxed italic">
            &ldquo;{quote.text}&rdquo;
          </p>
          <footer className="mt-3 text-sm font-medium text-indigo-500">
            — {quote.author}
          </footer>
        </blockquote>
      ) : (
        <div className="mt-2 space-y-2 animate-pulse">
          <div className="h-4 bg-indigo-100 rounded w-full" />
          <div className="h-3 bg-indigo-100 rounded w-1/3" />
        </div>
      )}
    </div>
  );
}
