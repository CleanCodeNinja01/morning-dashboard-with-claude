# Morning Dashboard

A personal morning dashboard built with Next.js — everything you need at the start of your day in one clean view.

![Dashboard preview](preview.png)

## What's on it

- **Clock & date** — current time and greeting
- **Weather** — live conditions for your city (no API key needed)
- **Gmail inbox** — your latest unread emails
- **Google Calendar** — today's upcoming events
- **Tasks** — your to-do list for the day
- **World & Tech news** — headlines at a glance
- **Stocks** — quick market snapshot
- **Daily rituals, goals & habit tracker** — keep your routine in check

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd morning-dashboard-with-claude
npm install
```

### 2. Set up your environment

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Then fill in your values (see the Google setup section below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Google API setup (Gmail + Calendar)

Each user needs their own Google credentials. This is a one-time setup.

### Step 1 — Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **New Project**, give it any name, and create it

### Step 2 — Enable the APIs

1. In the sidebar, go to **APIs & Services → Library**
2. Search for and enable **Gmail API**
3. Search for and enable **Google Calendar API**

### Step 3 — Create OAuth credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth 2.0 Client ID**
3. Choose **Desktop app** as the application type
4. Download or copy the **Client ID** and **Client Secret**

### Step 4 — Get a refresh token

Run the helper script (it opens a browser for you to log in):

```bash
node scripts/get-gmail-token.mjs YOUR_CLIENT_ID YOUR_CLIENT_SECRET
```

Copy the refresh token it prints.

### Step 5 — Fill in `.env.local`

```env
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER_EMAIL=your-email@gmail.com
```

---

## Weather setup (optional)

Weather uses [Open-Meteo](https://open-meteo.com/) — free, no API key needed. It defaults to Karachi. To change your city, add these to `.env.local`:

```env
WEATHER_CITY=London
WEATHER_LAT=51.5074
WEATHER_LON=-0.1278
```

Find your latitude and longitude at [latlong.net](https://www.latlong.net/).

---

## Deploy on Vercel

The easiest way to share this with others:

1. Push the repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add your env variables in the Vercel project settings
4. Deploy — you get a public URL

Note: each person who wants Gmail/Calendar integration needs to go through the Google setup above with their own credentials and deploy their own instance.

---

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google APIs](https://developers.google.com/) (Gmail, Calendar)
- [Open-Meteo](https://open-meteo.com/) for weather
