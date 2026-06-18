"use client";

import { useEffect, useState } from "react";

interface Email {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-indigo-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
];

export default function EmailWidget() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gmail")
      .then((r) => r.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unread = emails.filter((e) => !e.read).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="widget-label">Inbox</p>
        {unread > 0 && (
          <span className="text-xs bg-indigo-500 text-white rounded-full px-2 py-0.5 font-medium">
            {unread} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {emails.map((email, i) => (
            <li key={email.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${
                    avatarColors[i % avatarColors.length]
                  }`}
                >
                  {initials(email.from)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${email.read ? "text-gray-500" : "font-semibold text-gray-800"}`}>
                      {email.from}
                    </p>
                    <p className="text-xs text-gray-400 flex-shrink-0">{email.time}</p>
                  </div>
                  <p className={`text-sm truncate ${email.read ? "text-gray-400" : "text-gray-700"}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{email.preview}</p>
                </div>
                {!email.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-xs text-gray-400 text-center">
          📬 Showing mock emails — <a href="#" className="text-indigo-400 underline">connect Gmail</a>
        </p>
      </div>
    </div>
  );
}
