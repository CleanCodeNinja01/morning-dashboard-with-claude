"use client";

import { useEffect, useState } from "react";

interface Prayer {
  name: string;
  time: string; // "HH:MM" 24h
  icon: string;
}

const PRAYERS: Prayer[] = [
  { name: "Fajr",    time: "05:12", icon: "🌅" },
  { name: "Dhuhr",  time: "13:05", icon: "☀️" },
  { name: "Asr",    time: "16:48", icon: "🌤️" },
  { name: "Maghrib",time: "19:28", icon: "🌆" },
  { name: "Isha",   time: "20:58", icon: "🌙" },
];

interface Ritual {
  key: string;
  label: string;
  icon: string;
}

const RITUALS: Ritual[] = [
  { key: "quran",  label: "Quran",  icon: "📖" },
  { key: "azkar",  label: "Azkar",  icon: "🤲" },
  { key: "duaa",   label: "Duaa",   icon: "🌙" },
];

const RITUAL_KEY = "morning_rituals";
const PRAYER_KEY = "morning_prayers";
const RITUAL_DATE = "morning_rituals_date";

function todayStr() { return new Date().toDateString(); }

function parseTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function getNextPrayer() {
  const now = nowMinutes();
  const next = PRAYERS.find((p) => parseTime(p.time) > now);
  return next ?? PRAYERS[0];
}

function countdown(prayer: Prayer) {
  const now = nowMinutes();
  let diff = parseTime(prayer.time) - now;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function loadState(key: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const date = localStorage.getItem(RITUAL_DATE);
  if (date !== todayStr()) return {};
  try { return JSON.parse(localStorage.getItem(key) ?? "{}"); } catch { return {}; }
}

function saveState(key: string, state: Record<string, boolean>) {
  localStorage.setItem(RITUAL_DATE, todayStr());
  localStorage.setItem(key, JSON.stringify(state));
}

export default function RitualsWidget() {
  const [now, setNow] = useState(new Date());
  const [prayersOpen, setPrayersOpen] = useState(false);
  const [prayerDone, setPrayerDone] = useState<Record<string, boolean>>({});
  const [ritualDone, setRitualDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPrayerDone(loadState(PRAYER_KEY));
    setRitualDone(loadState(RITUAL_KEY));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const nextPrayer = getNextPrayer();
  const donePrayers = PRAYERS.filter((p) => prayerDone[p.name]).length;

  function togglePrayer(name: string) {
    const next = { ...prayerDone, [name]: !prayerDone[name] };
    setPrayerDone(next);
    saveState(PRAYER_KEY, next);
  }

  function toggleRitual(key: string) {
    const next = { ...ritualDone, [key]: !ritualDone[key] };
    setRitualDone(next);
    saveState(RITUAL_KEY, next);
  }

  const currentNow = nowMinutes();

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="widget-label mb-0">Daily Rituals</p>
        <span className="text-xs font-medium text-indigo-500">
          {donePrayers} of 5 prayers ✓
        </span>
      </div>

      {/* Next prayer countdown */}
      <div className="bg-indigo-50 rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
            Next · {nextPrayer.name}
          </p>
          <p className="text-lg font-semibold text-indigo-800 leading-none">
            {nextPrayer.time.replace(":", ":")} {parseInt(nextPrayer.time) < 12 ? "AM" : "PM"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-indigo-400 mb-0.5">Countdown</p>
          <p className="text-lg font-semibold text-indigo-800 leading-none tabular-nums">
            {countdown(nextPrayer)}
          </p>
        </div>
      </div>

      {/* Prayer list */}
      <div
        className="flex-1 min-h-0 overflow-y-auto pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
      >
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setPrayersOpen((open) => !open)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            aria-expanded={prayersOpen}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🕌</span>
              <p className="text-xs font-semibold text-gray-700">Prayers</p>
              <span className="text-xs text-gray-400">{donePrayers}/5 done</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${prayersOpen ? "rotate-180" : ""}`}
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {prayersOpen && (
            <div className="flex flex-col gap-1.5 mt-1.5">
              {PRAYERS.map((p) => {
                const passed = parseTime(p.time) < currentNow;
                const isNext = p.name === nextPrayer.name;
                const done = prayerDone[p.name];

                return (
                  <div
                    key={p.name}
                    onClick={() => togglePrayer(p.name)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                      isNext
                        ? "bg-indigo-50 border border-indigo-200"
                        : "bg-gray-50"
                    } ${passed && !done ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{p.icon}</span>
                      <p className={`text-xs font-medium ${isNext ? "text-indigo-800" : "text-gray-700"}`}>
                        {p.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs ${isNext ? "text-indigo-500 font-medium" : "text-gray-400"}`}>
                        {p.time}
                        {isNext && <span className="ml-1 text-indigo-400">· next</span>}
                      </p>
                      <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors ${
                        done ? "bg-indigo-500" : isNext ? "border-2 border-indigo-300" : "border border-gray-300"
                      }`}>
                        {done && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quran / Azkar / Duaa strip */}
        <div className="flex gap-1.5 pt-2 border-t border-gray-100">
          {RITUALS.map((r) => {
            const done = ritualDone[r.key];
            return (
              <button
                key={r.key}
                onClick={() => toggleRitual(r.key)}
                className={`flex-1 flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${
                  done ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{r.icon}</span>
                  <span className={`text-xs font-medium ${done ? "text-indigo-700" : "text-gray-700"}`}>
                    {r.label}
                  </span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-[3px] flex items-center justify-center flex-shrink-0 ${
                  done ? "bg-indigo-500" : "border border-gray-300"
                }`}>
                  {done && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
