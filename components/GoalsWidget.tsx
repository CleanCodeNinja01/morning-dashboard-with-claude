"use client";

import { useState, useRef, useEffect } from "react";

type Period = "daily" | "weekly" | "monthly" | "yearly";
type Tab = "short" | "long";

interface Goal {
  id: number;
  text: string;
  period: Period;
  progress: number;
  tab: Tab;
}

const GOALS_KEY = "morning_goals_v2";

const PERIOD_STYLES: Record<Period, { bg: string; text: string; label: string }> = {
  daily:   { bg: "bg-indigo-100",  text: "text-indigo-700",  label: "DAILY"   },
  weekly:  { bg: "bg-amber-100",   text: "text-amber-700",   label: "WEEKLY"  },
  monthly: { bg: "bg-violet-100",  text: "text-violet-700",  label: "MONTHLY" },
  yearly:  { bg: "bg-rose-100",    text: "text-rose-700",    label: "YEARLY"  },
};

const PERIOD_BAR: Record<Period, string> = {
  daily:   "bg-indigo-500",
  weekly:  "bg-amber-500",
  monthly: "bg-violet-500",
  yearly:  "bg-rose-500",
};

const SEED_GOAL: Goal = {
  id: 1,
  text: "Read 30 min",
  period: "daily",
  progress: 0,
  tab: "short",
};

function normalizeGoal(raw: Partial<Goal> & { target?: number }): Goal {
  const period = raw.period ?? "daily";
  let progress = raw.progress ?? 0;
  if (raw.target && raw.target > 0 && progress <= raw.target) {
    progress = Math.round((progress / raw.target) * 100);
  }
  return {
    id: raw.id!,
    text: raw.text ?? "",
    period,
    progress: Math.min(100, Math.max(0, progress)),
    tab: raw.tab ?? tabForPeriod(period),
  };
}

function tabForPeriod(period: Period): Tab {
  return period === "daily" || period === "weekly" ? "short" : "long";
}

function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [SEED_GOAL];
  try {
    const saved = JSON.parse(localStorage.getItem(GOALS_KEY) ?? localStorage.getItem("morning_goals_v1") ?? "");
    if (Array.isArray(saved) && saved.length > 0) return saved.map(normalizeGoal);
  } catch { /* use defaults */ }
  return [SEED_GOAL];
}

function saveGoals(goals: Goal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

function nextGoalId(goals: Goal[]) {
  return goals.reduce((max, g) => Math.max(max, g.id), 0) + 1;
}

export default function GoalsWidget() {
  const [tab, setTab] = useState<Tab>("short");
  const [goals, setGoals] = useState<Goal[]>([SEED_GOAL]);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPeriod, setNewPeriod] = useState<Period>("daily");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editPeriod, setEditPeriod] = useState<Period>("daily");
  const [editingProgressId, setEditingProgressId] = useState<number | null>(null);
  const [editProgress, setEditProgress] = useState("");
  const addRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  useEffect(() => {
    if (adding) addRef.current?.focus();
  }, [adding]);

  useEffect(() => {
    if (editingId !== null) editRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (editingProgressId !== null) progressRef.current?.focus();
  }, [editingProgressId]);

  function persist(updated: Goal[]) {
    setGoals(updated);
    saveGoals(updated);
  }

  const visible = goals.filter((g) => g.tab === tab);

  function addGoal() {
    if (!newText.trim()) { setAdding(false); return; }
    const period = newPeriod;
    persist([
      ...goals,
      {
        id: nextGoalId(goals),
        text: newText.trim(),
        period,
        progress: 0,
        tab: tabForPeriod(period),
      },
    ]);
    setNewText("");
    setAdding(false);
  }

  function updateProgress(id: number, progress: number) {
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    persist(goals.map((g) => (g.id === id ? { ...g, progress: clamped } : g)));
  }

  function startEditProgress(goal: Goal) {
    setEditingProgressId(goal.id);
    setEditProgress(String(goal.progress));
  }

  function saveProgressEdit() {
    if (editingProgressId === null) return;
    const value = parseInt(editProgress, 10);
    if (!Number.isNaN(value)) updateProgress(editingProgressId, value);
    setEditingProgressId(null);
  }

  function removeGoal(id: number) {
    if (editingId === id) setEditingId(null);
    persist(goals.filter((g) => g.id !== id));
  }

  function startEdit(goal: Goal) {
    setAdding(false);
    setEditingId(goal.id);
    setEditText(goal.text);
    setEditPeriod(goal.period);
  }

  function saveEdit() {
    if (editingId === null || !editText.trim()) {
      setEditingId(null);
      return;
    }
    const period = editPeriod;
    persist(
      goals.map((g) =>
        g.id === editingId
          ? { ...g, text: editText.trim(), period, tab: tabForPeriod(period) }
          : g
      )
    );
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="widget-label mb-0">Goals</p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setTab("short"); setNewPeriod("daily"); }}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              tab === "short" ? "bg-indigo-500 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            Short
          </button>
          <button
            onClick={() => { setTab("long"); setNewPeriod("monthly"); }}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              tab === "long" ? "bg-indigo-500 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            Long
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setAdding(true);
              setNewPeriod(tab === "short" ? "daily" : "monthly");
            }}
            className="text-xs px-2.5 py-1 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {adding && (
        <div className="flex gap-1.5 mb-2 flex-shrink-0">
          <input
            ref={addRef}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addGoal(); if (e.key === "Escape") setAdding(false); }}
            placeholder="Goal description..."
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-800"
          />
          <select
            value={newPeriod}
            onChange={(e) => {
              const period = e.target.value as Period;
              setNewPeriod(period);
              setTab(tabForPeriod(period));
            }}
            className="text-xs border border-gray-200 rounded-lg px-1.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={addGoal} className="text-xs px-2.5 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            Add
          </button>
        </div>
      )}

      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
      >
        {visible.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-2xl">🎯</span>
            <p className="text-xs text-gray-400">No {tab === "short" ? "short-term" : "long-term"} goals yet</p>
            <button
              onClick={() => {
                setEditingId(null);
                setAdding(true);
                setNewPeriod(tab === "short" ? "daily" : "monthly");
              }}
              className="text-xs text-indigo-500 underline"
            >
              Add one
            </button>
          </div>
        )}

        {visible.map((goal) => {
          const pct = goal.progress;
          const ps = PERIOD_STYLES[goal.period];
          const bar = PERIOD_BAR[goal.period];
          const isEditing = editingId === goal.id;
          const isEditingProgress = editingProgressId === goal.id;

          if (isEditing) {
            return (
              <div key={goal.id} className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex-shrink-0">
                <div className="flex gap-1.5 mb-2">
                  <input
                    ref={editRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="flex-1 text-xs border border-indigo-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-800"
                  />
                  <select
                    value={editPeriod}
                    onChange={(e) => {
                      const period = e.target.value as Period;
                      setEditPeriod(period);
                      setTab(tabForPeriod(period));
                    }}
                    className="text-xs border border-indigo-200 rounded-lg px-1.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-600"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="flex gap-1.5 justify-end">
                  <button onClick={cancelEdit} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-white">
                    Cancel
                  </button>
                  <button onClick={saveEdit} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600">
                    Save
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={goal.id} className="bg-gray-50 rounded-xl p-3 group relative">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ps.bg} ${ps.text}`}>
                    {ps.label}
                  </span>
                  <p className="text-xs font-medium text-gray-800 truncate">{goal.text}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isEditingProgress ? (
                    <input
                      ref={progressRef}
                      type="number"
                      min={0}
                      max={100}
                      value={editProgress}
                      onChange={(e) => setEditProgress(e.target.value)}
                      onBlur={saveProgressEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveProgressEdit();
                        if (e.key === "Escape") setEditingProgressId(null);
                      }}
                      className="w-10 text-xs text-right border border-indigo-200 rounded px-1 py-0.5 outline-none focus:border-indigo-400 bg-white text-gray-800"
                    />
                  ) : (
                    <button
                      onClick={() => startEditProgress(goal)}
                      className="text-xs font-semibold text-gray-600 hover:text-indigo-600 tabular-nums"
                      title="Update progress"
                    >
                      {pct}%
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(goal)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-indigo-500 text-xs leading-none"
                    title="Edit goal"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 text-xs leading-none"
                    title="Remove goal"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div
                  className={`${bar} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={pct}
                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value, 10))}
                className="w-full h-1 accent-indigo-500 cursor-pointer"
                aria-label={`Progress for ${goal.text}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
