import { NextResponse } from "next/server";
import {
  firstNameFromDisplayName,
  firstNameFromEmail,
  getGmailClient,
} from "@/lib/gmail";

export async function GET() {
  try {
    const gmail = getGmailClient();

    try {
      const sendAs = await gmail.users.settings.sendAs.list({ userId: "me" });
      const primary =
        sendAs.data.sendAs?.find((entry) => entry.isPrimary) ??
        sendAs.data.sendAs?.[0];

      if (primary?.displayName) {
        return NextResponse.json({
          name: firstNameFromDisplayName(primary.displayName),
        });
      }
    } catch {
      // sendAs requires gmail.settings.basic; fall through to profile email
    }

    const profile = await gmail.users.getProfile({ userId: "me" });
    const email = profile.data.emailAddress ?? process.env.GMAIL_USER_EMAIL;

    if (email) {
      return NextResponse.json({ name: firstNameFromEmail(email) });
    }

    return NextResponse.json({ name: null });
  } catch (err) {
    console.error("Gmail profile error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
