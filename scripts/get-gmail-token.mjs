import { createServer } from "http";
import { exec } from "child_process";
import { URL } from "url";

const CLIENT_ID = process.argv[2];
const CLIENT_SECRET = process.argv[3];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Usage: node scripts/get-gmail-token.mjs YOUR_CLIENT_ID YOUR_CLIENT_SECRET");
  process.exit(1);
}

const REDIRECT_URI = "http://localhost:4242";
const SCOPE = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.settings.basic",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n👉 Opening browser for Google sign-in...\n");
exec(`open "${authUrl}"`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("No code found.");
    return;
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  res.end("✅ Done! Check your terminal.");
  server.close();

  console.log("\n✅ Add these to your .env.local:\n");
  console.log(`GMAIL_CLIENT_ID=${CLIENT_ID}`);
  console.log(`GMAIL_CLIENT_SECRET=${CLIENT_SECRET}`);
  console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(`GMAIL_USER_EMAIL=saleha.shujaat1@gmail.com`);
  console.log();
}).listen(4242, () => {
  console.log("Waiting for Google to redirect back...\n");
});
