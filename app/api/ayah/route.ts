import { NextResponse } from "next/server";
import { dayOfYear } from "@/lib/day";

export interface AyahResponse {
  arabic: string;
  text: string;
  ref: string;
}

const TOTAL_AYAHS = 6236;

export async function GET() {
  try {
    const ayahNumber = ((dayOfYear() * 17 + 42) % TOTAL_AYAHS) + 1;

    const [arabicRes, englishRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/quran-uthmani`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.sahih`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (!arabicRes.ok || !englishRes.ok) {
      throw new Error("AlQuran API request failed");
    }

    const arabicData = await arabicRes.json();
    const englishData = await englishRes.json();

    const surah = englishData.data?.surah;
    const ref = surah
      ? `Surah ${surah.englishName} ${surah.number}:${englishData.data.numberInSurah}`
      : `Ayah ${ayahNumber}`;

    const ayah: AyahResponse = {
      arabic: arabicData.data?.text ?? "",
      text: englishData.data?.text ?? "",
      ref,
    };

    return NextResponse.json(ayah);
  } catch (err) {
    console.error("Ayah API error:", err);
    return NextResponse.json({ error: "Failed to fetch ayah" }, { status: 500 });
  }
}
