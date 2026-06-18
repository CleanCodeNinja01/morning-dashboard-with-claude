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

const avatarStyles = [
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
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
    <div className="card flex flex-col" style={{ height: "300px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="widget-label mb-0">Inbox</p>
        {unread > 0 && (
          <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 font-medium">
            {unread} unread
          </span>
        )}
      </div>

      {/* Scrollable list */}
      <div
        className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-50 pr-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#E0E0E0 transparent",
        }}
      >
        {loading ? (
          <div className="space-y-4 pt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded w-full" />
                  <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          emails.map((email, i) => {
            const av = avatarStyles[i % avatarStyles.length];
            return (
              <div key={email.id} className="flex items-start gap-3 py-2.5 first:pt-0">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${av.bg} ${av.text}`}
                >
                  {initials(email.from)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${email.read ? "text-gray-500" : "font-semibold text-gray-800"}`}>
                      {email.from}
                    </p>
                    <p className="text-xs text-gray-400 flex-shrink-0">{email.time}</p>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${email.read ? "text-gray-400" : "text-gray-700"}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{email.preview}</p>
                </div>

                {/* Unread dot */}
                {!email.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-2 border-t border-gray-50 flex-shrink-0">
        <p className="text-xs text-gray-400 text-center">
          Showing real inbox ·{" "}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Open Gmail
          </a>
        </p>
      </div>
    </div>
  );
}
