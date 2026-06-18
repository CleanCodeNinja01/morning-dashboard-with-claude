import { NextResponse } from "next/server";

// TODO: Wire up Gmail OAuth
// Required env vars (see .env.local.example):
//   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER_EMAIL
//
// Steps to get credentials:
//   1. Go to https://console.cloud.google.com → New Project
//   2. Enable "Gmail API"
//   3. Create OAuth 2.0 credentials (Desktop app type)
//   4. Run the one-time auth flow to get a refresh token
//   5. Add values to .env.local

const MOCK_EMAILS = [
  {
    id: "1",
    from: "Sarah Ahmed",
    email: "sarah@launchgood.com",
    subject: "Q3 Campaign Review — Action needed",
    preview: "Hey, can you take a look at the slides before our 2pm call? I've updated the...",
    time: "8:14 AM",
    read: false,
  },
  {
    id: "2",
    from: "GitHub",
    email: "noreply@github.com",
    subject: "[launchgood/rebuild] PR #412 merged",
    preview: "fix(api): scale up rest-api-facade CPU was merged by CleanCodeNinja01.",
    time: "7:52 AM",
    read: true,
  },
  {
    id: "3",
    from: "Notion",
    email: "notification@notion.so",
    subject: "Omar mentioned you in a comment",
    preview: "@saleha can you update the roadmap doc with the new launch date? Thanks!",
    time: "7:30 AM",
    read: false,
  },
];

export async function GET() {
  // When Gmail is wired up, replace this with real API call using googleapis
  return NextResponse.json(MOCK_EMAILS);
}
