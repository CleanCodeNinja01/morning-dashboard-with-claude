"use client";

import { useEffect, useState } from "react";

interface Stock {
  ticker: string;
  name: string;
  price: string;
  change: number;
}

interface Index {
  label: string;
  change: number;
}

const INDICES: Index[] = [
  { label: "S&P 500", change: 0.8 },
  { label: "NASDAQ", change: -0.3 },
  { label: "KSE-100", change: 1.2 },
];

const STOCKS: Stock[] = [
  { ticker: "AAPL", name: "Apple", price: "$213.40", change: 1.24 },
  { ticker: "MSFT", name: "Microsoft", price: "$441.20", change: 0.87 },
  { ticker: "NVDA", name: "Nvidia", price: "$134.60", change: 2.11 },
  { ticker: "GOOGL", name: "Alphabet", price: "$178.90", change: -0.43 },
  { ticker: "META", name: "Meta", price: "$524.10", change: 1.05 },
  { ticker: "BTC", name: "Bitcoin", price: "$97,200", change: -1.32 },
  { ticker: "ETH", name: "Ethereum", price: "$3,410", change: 0.94 },
];

function sentiment(indices: Index[]) {
  const avg = indices.reduce((s, i) => s + i.change, 0) / indices.length;
  if (avg > 0.3) return { label: "Bullish", bg: "bg-emerald-100", text: "text-emerald-700" };
  if (avg < -0.3) return { label: "Bearish", bg: "bg-red-100", text: "text-red-700" };
  return { label: "Neutral", bg: "bg-amber-100", text: "text-amber-700" };
}

export default function StocksWidget() {
  const [updated, setUpdated] = useState("just now");
  const mood = sentiment(INDICES);

  useEffect(() => {
    let mins = 0;
    const t = setInterval(() => {
      mins++;
      setUpdated(`${mins}m ago`);
    }, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="widget-label mb-0">Markets</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mood.bg} ${mood.text}`}>
            📈 {mood.label}
          </span>
          <span className="text-xs text-gray-400">{updated}</span>
        </div>
      </div>

      {/* Index strip */}
      <div className="grid grid-cols-3 gap-1.5 mb-3 flex-shrink-0">
        {INDICES.map((idx) => {
          const up = idx.change >= 0;
          return (
            <div
              key={idx.label}
              className={`rounded-lg px-2 py-1.5 text-center border ${
                up
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-red-50 border-red-100"
              }`}
            >
              <p className={`text-xs font-medium mb-0.5 ${up ? "text-emerald-700" : "text-red-700"}`}>
                {idx.label}
              </p>
              <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-600"}`}>
                {up ? "+" : ""}{idx.change}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Watchlist */}
      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
      >
        {STOCKS.map((s) => {
          const up = s.change >= 0;
          return (
            <div
              key={s.ticker}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg ${
                up ? "bg-emerald-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${up ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs font-semibold text-gray-900">{s.ticker}</span>
                <span className="text-xs text-gray-400">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-800">{s.price}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                  up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>
                  {up ? "+" : ""}{s.change}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
