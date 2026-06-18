"use client";

import { useState } from "react";

const initialTasks = [
  { id: 1, text: "Review Q3 campaign slides", done: false, priority: "high" },
  { id: 2, text: "Team standup at 10:00 AM", done: false, priority: "high" },
  { id: 3, text: "Finish API route for checkout service", done: true, priority: "medium" },
  { id: 4, text: "Update roadmap doc with new launch date", done: false, priority: "medium" },
  { id: 5, text: "Block time for deep work this afternoon", done: false, priority: "low" },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-600",
  medium: "bg-amber-100 text-amber-600",
  low: "bg-green-100 text-green-600",
};

export default function TasksWidget() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggle = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="widget-label">Today&apos;s Tasks</p>
        <span className="text-xs text-gray-400">{done}/{tasks.length} done</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all"
          style={{ width: `${(done / tasks.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => toggle(task.id)}
          >
            <div
              className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                task.done
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-gray-300 group-hover:border-indigo-400"
              }`}
            >
              {task.done && (
                <svg className="w-full h-full text-white p-0.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm flex-1 ${
                task.done ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {task.text}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
