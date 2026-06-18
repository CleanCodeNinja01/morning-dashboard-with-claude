"use client";

import { useEffect, useRef, useState } from "react";

interface Habit {
  id: number;
  label: string;
  icon: string;
  streak: number;
  done: boolean;
}

const HABIT_KEY = "morning_habits_v3";
const HABIT_DATE = "morning_habits_date";

const DEFAULT_HABITS: Habit[] = [
  { id: 1, label: "Exercise", icon: "🤸", streak: 5, done: false },
  { id: 2, label: "Read",     icon: "📖", streak: 7, done: false },
];

function flameColor(streak: number) {
  if (streak >= 10) return "text-orange-500 font-bold";
  if (streak >= 5)  return "text-orange-400 font-medium";
  return "text-gray-400";
}

function loadHabits(): Habit[] {
  if (typeof window === "undefined") return DEFAULT_HABITS;
  const date = localStorage.getItem(HABIT_DATE);
  if (date !== new Date().toDateString()) return DEFAULT_HABITS;
  try {
    const saved = JSON.parse(localStorage.getItem(HABIT_KEY) ?? "");
    return saved as Habit[];
  } catch { return DEFAULT_HABITS; }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABIT_DATE, new Date().toDateString());
  localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}

let nextId = DEFAULT_HABITS.length + 1;

export default function HabitTrackerWidget() {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState("⭐");
  const addRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  useEffect(() => {
    if (adding) addRef.current?.focus();
  }, [adding]);

  function toggle(id: number) {
    setHabits((prev) => {
      const next = prev.map((h) =>
        h.id === id
          ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) }
          : h
      );
      // Sort: pending first, done last
      const sorted = [...next.filter((h) => !h.done), ...next.filter((h) => h.done)];
      saveHabits(sorted);
      return sorted;
    });
  }

  function addHabit() {
    if (!newLabel.trim()) { setAdding(false); return; }
    const habit: Habit = { id: nextId++, label: newLabel.trim(), icon: newIcon, streak: 0, done: false };
    setHabits((prev) => {
      const next = [habit, ...prev.filter((h) => !h.done), ...prev.filter((h) => h.done)];
      saveHabits(next);
      return next;
    });
    setNewLabel("");
    setAdding(false);
  }

  function removeHabit(id: number) {
    setHabits((prev) => {
      const next = prev.filter((h) => h.id !== id);
      saveHabits(next);
      return next;
    });
  }

  const done = habits.filter((h) => h.done).length;
  const total = habits.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <p className="widget-label mb-0">Today&apos;s Habits</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            {done} / {total} done
          </span>
          <button
            onClick={() => setAdding(true)}
            className="text-xs px-2.5 py-1 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 mb-3">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Add input */}
      {adding && (
        <div className="flex gap-1.5 mb-2 flex-shrink-0">
          <input
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            className="w-10 text-center text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
            maxLength={2}
          />
          <input
            ref={addRef}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addHabit(); if (e.key === "Escape") setAdding(false); }}
            placeholder="Habit name..."
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-800"
          />
          <button onClick={addHabit} className="text-xs px-2.5 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            Add
          </button>
        </div>
      )}

      {/* Habit list */}
      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
      >
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggle(habit.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all group ${
              habit.done
                ? "bg-gray-50 opacity-60"
                : "bg-white border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30"
            }`}
          >
            <span className={`text-base flex-shrink-0 transition-all ${habit.done ? "grayscale" : ""}`}>
              {habit.icon}
            </span>

            <p className={`text-xs flex-1 ${habit.done ? "line-through text-gray-400" : "font-medium text-gray-800"}`}>
              {habit.label}
            </p>

            {/* Streak */}
            <span className={`text-xs flex-shrink-0 ${habit.done ? "text-gray-300" : flameColor(habit.streak)}`}>
              🔥 {habit.streak}
            </span>

            {/* Delete */}
            <button
              onClick={(e) => { e.stopPropagation(); removeHabit(habit.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-200 hover:text-red-400 text-xs leading-none mr-1"
            >
              ✕
            </button>

            {/* Checkbox */}
            <div
              className={`w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center transition-colors ${
                habit.done ? "bg-indigo-500" : "border-2 border-gray-200"
              }`}
            >
              {habit.done && (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
