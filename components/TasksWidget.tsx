"use client";

import { useState, useRef, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
}

const TASKS_KEY = "morning_tasks";
const NEXT_ID_KEY = "morning_tasks_next_id";

const SEED_TASK: Task = {
  id: 1,
  text: "Plan your top 3 priorities for today",
  done: false,
  priority: "medium",
};

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

const priorityCycle: Record<string, Task["priority"]> = {
  high: "medium",
  medium: "low",
  low: "high",
};

function loadTasks(): { tasks: Task[]; nextId: number } {
  if (typeof window === "undefined") {
    return { tasks: [SEED_TASK], nextId: 2 };
  }

  try {
    const saved = localStorage.getItem(TASKS_KEY);
    const nextId = parseInt(localStorage.getItem(NEXT_ID_KEY) ?? "2");

    if (saved) {
      const tasks = JSON.parse(saved) as Task[];
      if (Array.isArray(tasks) && tasks.length > 0) {
        const maxId = Math.max(...tasks.map((t) => t.id));
        return { tasks, nextId: Math.max(nextId, maxId + 1) };
      }
    }
  } catch {
    // fall through to seed
  }

  return { tasks: [SEED_TASK], nextId: 2 };
}

function saveTasks(tasks: Task[], nextId: number) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  localStorage.setItem(NEXT_ID_KEY, String(nextId));
}

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([SEED_TASK]);
  const [nextId, setNextId] = useState(2);
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const editRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { tasks: loaded, nextId: id } = loadTasks();
    setTasks(loaded);
    setNextId(id);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTasks(tasks, nextId);
  }, [tasks, nextId, hydrated]);

  useEffect(() => {
    if (editingId !== null) editRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (adding) addRef.current?.focus();
  }, [adding]);

  const done = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const commitEdit = () => {
    if (editText.trim()) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text: editText.trim() } : t))
      );
    }
    setEditingId(null);
  };

  const cyclePriority = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: priorityCycle[t.priority] } : t))
    );

  const addTask = () => {
    if (!newText.trim()) {
      setAdding(false);
      return;
    }
    setTasks((prev) => [
      ...prev,
      { id: nextId, text: newText.trim(), done: false, priority: newPriority },
    ]);
    setNextId((id) => id + 1);
    setNewText("");
    setAdding(false);
  };

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <p className="widget-label mb-0">Tasks</p>
        <button
          onClick={() => setAdding(true)}
          className="text-xs px-2.5 py-1 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          + Add
        </button>
      </div>

      <div className="flex-shrink-0 mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-gray-400">{done} of {tasks.length} done</span>
          <span className="text-xs font-medium text-indigo-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {adding && (
        <div className="flex gap-2 mb-2 flex-shrink-0">
          <input
            ref={addRef}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="New task..."
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-800"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
            className="text-xs border border-gray-200 rounded-lg px-1.5 py-1.5 outline-none focus:border-indigo-400 bg-white text-gray-600"
          >
            <option value="high">High</option>
            <option value="medium">Med</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={addTask}
            className="text-xs px-2.5 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
      )}

      <div
        className="flex-1 min-h-0 overflow-y-auto pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0 group"
          >
            <button
              onClick={() => toggle(task.id)}
              className={`w-4 h-4 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${
                task.done
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              {task.done && (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {editingId === task.id ? (
              <input
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 text-xs border border-indigo-300 rounded px-1.5 py-0.5 outline-none bg-white text-gray-800"
              />
            ) : (
              <span
                className={`flex-1 text-xs truncate ${
                  task.done ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {task.text}
              </span>
            )}

            <button
              onClick={() => cyclePriority(task.id)}
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityStyles[task.priority]}`}
              title="Click to change priority"
            >
              {task.priority === "medium" ? "med" : task.priority}
            </button>

            <button
              onClick={() => startEdit(task)}
              className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
              title="Edit"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M7 1.5l1.5 1.5-5 5H2v-1.5l5-5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={() => remove(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md border border-gray-200 bg-gray-50 hover:bg-red-50 hover:border-red-200 hover:text-red-500 flex items-center justify-center flex-shrink-0"
              title="Delete"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
