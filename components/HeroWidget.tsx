"use client";

import { useEffect, useState } from "react";
import type { AyahResponse } from "@/app/api/ayah/route";
import type { QuoteResponse } from "@/app/api/quote/route";

const CHECKIN_KEY = "morning_checkin";
const STREAK_KEY = "morning_streak";
const LAST_DATE_KEY = "morning_last_date";

function todayStr() {
  return new Date().toDateString();
}

function loadCheckin(): { time: string | null; streak: number } {
  if (typeof window === "undefined") return { time: null, streak: 0 };
  const lastDate = localStorage.getItem(LAST_DATE_KEY);
  const streak = parseInt(localStorage.getItem(STREAK_KEY) ?? "0");

  if (lastDate === todayStr()) {
    return { time: localStorage.getItem(CHECKIN_KEY), streak };
  }

  return { time: null, streak };
}

export default function HeroWidget() {
  const [now, setNow] = useState(new Date());
  const [checkinTime, setCheckinTime] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [ayah, setAyah] = useState<AyahResponse | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  useEffect(() => {
    const { time, streak: s } = loadCheckin();
    setCheckinTime(time);
    setStreak(s);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/ayah")
      .then((r) => r.json())
      .then((data) => {
        if (data.arabic) setAyah(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((data) => {
        if (data.text) setQuote(data);
      })
      .catch(() => {});
  }, []);

  function handleCheckin() {
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const lastDate = localStorage.getItem(LAST_DATE_KEY);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const newStreak =
      lastDate === yesterday.toDateString() ? streak + 1 : 1;

    localStorage.setItem(CHECKIN_KEY, timeStr);
    localStorage.setItem(STREAK_KEY, String(newStreak));
    localStorage.setItem(LAST_DATE_KEY, todayStr());

    setCheckinTime(timeStr);
    setStreak(newStreak);
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 2000);
  }

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card col-span-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">{dateStr}</p>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <span aria-hidden="true">☕</span>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Morning Brief
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
            <p className="text-xl font-semibold text-gray-900 tabular-nums tracking-tight">
              {timeStr.slice(0, -3)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{timeStr.slice(-2)}</p>
          </div>

          <div className="text-center px-4 py-2 bg-indigo-50 rounded-xl">
            <p className="text-xl font-semibold text-indigo-600 tabular-nums">{streak}</p>
            <p className="text-xs text-indigo-400 mt-0.5">day streak</p>
          </div>

          {checkinTime ? (
            <div className="text-center px-4 py-2 bg-green-50 rounded-xl">
              <p className="text-xs font-medium text-green-600">Checked in</p>
              <p className="text-sm font-semibold text-green-700 mt-0.5">{checkinTime}</p>
            </div>
          ) : (
            <button
              onClick={handleCheckin}
              className={`flex flex-col items-center px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                justCheckedIn
                  ? "bg-green-500 text-white scale-95"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              {justCheckedIn ? (
                <>
                  <svg className="w-4 h-4 mb-0.5" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Done!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mb-0.5" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Start my day
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="border-l-2 border-indigo-400 pl-4 py-1 mb-4">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
          Ayah of the day
        </p>
        {ayah ? (
          <>
            <p
              className="font-arabic-quran text-right text-2xl text-gray-800 leading-loose mb-2"
              dir="rtl"
              lang="ar"
            >
              {ayah.arabic}
            </p>
            <p className="text-sm text-gray-700 italic leading-relaxed">
              &ldquo;{ayah.text}&rdquo;
            </p>
            <p className="text-xs text-gray-400 mt-1.5">{ayah.ref}</p>
          </>
        ) : (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-3/4 ml-auto" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3">
        <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3H2v5h3l-1 4h2L7 7V3H6zm7 0h-4v5h3l-1 4h2l1-5V3h-1z" />
        </svg>
        <div className="flex-1">
          {quote ? (
            <>
              <p className="text-sm text-gray-600 italic leading-relaxed">{quote.text}</p>
              <p className="text-xs text-gray-400 mt-1">— {quote.author}</p>
            </>
          ) : (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
