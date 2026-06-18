import { NextResponse } from "next/server";
import { getGmailClient } from "@/lib/gmail";

function parseFrom(raw: string): { name: string; email: string } {
  const match = raw.match(/^(.+?)\s*<(.+?)>$/);
  if (match) return { name: match[1].replace(/"/g, ""), email: match[2] };
  return { name: raw, email: raw };
}

function formatTime(internalDate: string): string {
  const date = new Date(parseInt(internalDate));
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET() {
  try {
    const gmail = getGmailClient();

    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 8,
      labelIds: ["INBOX"],
    });

    const messages = list.data.messages ?? [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject"],
        });

        const headers = detail.data.payload?.headers ?? [];
        const rawFrom = headers.find((h) => h.name === "From")?.value ?? "";
        const subject = headers.find((h) => h.name === "Subject")?.value ?? "(no subject)";
        const { name, email } = parseFrom(rawFrom);
        const snippet = detail.data.snippet ?? "";
        const isUnread = detail.data.labelIds?.includes("UNREAD") ?? false;

        return {
          id: msg.id,
          from: name,
          email,
          subject,
          preview: snippet,
          time: formatTime(detail.data.internalDate ?? "0"),
          read: !isUnread,
        };
      })
    );

    return NextResponse.json(emails);
  } catch (err) {
    console.error("Gmail API error:", err);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
