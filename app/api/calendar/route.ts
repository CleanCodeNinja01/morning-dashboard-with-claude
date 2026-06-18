import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/gmail";

export interface CalendarEventResponse {
  id: string;
  title: string;
  time: string;
  duration: string;
  location: string;
  upcoming: boolean;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(start: Date, end: Date): string {
  const mins = Math.round((end.getTime() - start.getTime()) / 60000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hrs} hr ${rem} min` : `${hrs} hr`;
}

export async function GET() {
  try {
    const calendar = getCalendarClient();
    const now = new Date();
    const timeMin = startOfDay(now).toISOString();
    const timeMax = endOfDay(now).toISOString();

    const list = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 20,
    });

    const events: CalendarEventResponse[] = (list.data.items ?? [])
      .filter((event) => event.status !== "cancelled")
      .map((event) => {
        const isAllDay = Boolean(event.start?.date);
        const start = isAllDay
          ? startOfDay(new Date(event.start!.date!))
          : new Date(event.start!.dateTime!);
        const end = isAllDay
          ? endOfDay(new Date(event.end!.date!))
          : new Date(event.end!.dateTime!);

        const upcoming = start.getTime() >= now.getTime();

        return {
          id: event.id ?? crypto.randomUUID(),
          title: event.summary ?? "(No title)",
          time: isAllDay ? "All day" : formatTime(start),
          duration: isAllDay ? "All day" : formatDuration(start, end),
          location: event.location ?? event.hangoutLink ?? "—",
          upcoming,
        };
      });

    return NextResponse.json(events);
  } catch (err) {
    console.error("Calendar API error:", err);
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 });
  }
}
