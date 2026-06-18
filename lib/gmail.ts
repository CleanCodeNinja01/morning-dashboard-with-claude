import { google } from "googleapis";

export function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "http://localhost:4242"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return oauth2Client;
}

export function getGmailClient() {
  return google.gmail({ version: "v1", auth: getOAuth2Client() });
}

export function getCalendarClient() {
  return google.calendar({ version: "v3", auth: getOAuth2Client() });
}

export function firstNameFromDisplayName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0];
}

export function firstNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const part = local.split(/[._-]/)[0] ?? local;
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}
