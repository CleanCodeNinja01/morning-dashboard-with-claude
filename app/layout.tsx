import type { Metadata } from "next";
import localFont from "next/font/local";
import { Scheherazade_New } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const arabicQuran = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-quran",
});

export const metadata: Metadata = {
  title: "Good Morning Dashboard",
  description: "Your personalized morning overview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${arabicQuran.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
