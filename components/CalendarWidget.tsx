"use client";

import { useEffect, useState } from "react";
import type { CalendarEventResponse } from "@/app/api/calendar/route";

export default function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card flex flex-col" style={{ height: "300px" }}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="widget-label mb-0">Today&apos;s meetings</p>
        {!loading && events.length > 0 && (
          <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 font-medium">
            {events.length} events
          </span>
        )}
        {!loading && events.length === 0 && (
          <span className="text-xs text-gray-400">{today}</span>
        )}
      </div>

      {loading && (
        <div className="flex-1 space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl">📅</span>
          <p className="text-sm font-medium text-gray-600">Could not load calendar</p>
          <p className="text-xs text-gray-400">
            Re-run the token script with Calendar scope enabled
          </p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl">📅</span>
          <p className="text-sm font-medium text-gray-600">No meetings today</p>
          <p className="text-xs text-gray-400">Enjoy the uninterrupted focus time!</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div
          className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-0.5"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#E0E0E0 transparent" }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-xl px-3 py-2.5 border-l-[3px] flex-shrink-0 ${
                event.upcoming
                  ? "bg-indigo-50 border-indigo-500"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-sm font-medium truncate ${
                    event.upcoming ? "text-indigo-800" : "text-gray-800"
                  }`}
                >
                  {event.title}
                </p>
                <span
                  className={`text-xs flex-shrink-0 ${
                    event.upcoming ? "text-indigo-500" : "text-gray-400"
                  }`}
                >
                  {event.time}
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  event.upcoming ? "text-indigo-400" : "text-gray-400"
                }`}
              >
                {event.duration} · {event.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
