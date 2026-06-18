"use client";

import { useEffect, useState } from "react";

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="card col-span-2">
      <p className="text-sm font-medium text-indigo-500 uppercase tracking-widest mb-1">
        {greeting} ☀️
      </p>
      <h1 className="text-6xl font-bold text-gray-900 tabular-nums tracking-tight">
        {time}
      </h1>
      <p className="mt-2 text-lg text-gray-500">{date}</p>
    </div>
  );
}
