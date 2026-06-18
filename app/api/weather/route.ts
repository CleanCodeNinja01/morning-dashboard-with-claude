import { NextResponse } from "next/server";
import { formatSunrise, uvLabel, weatherFromCode } from "@/lib/weather";

export interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  icon: string;
}

export interface WeatherResponse {
  city: string;
  temp: number;
  feels_like: number;
  condition: string;
  humidity: number;
  wind: number;
  uv: string;
  sunrise: string;
  icon: string;
  forecast: WeatherForecast[];
}

export async function GET() {
  try {
    const lat = process.env.WEATHER_LAT ?? "24.8607";
    const lon = process.env.WEATHER_LON ?? "67.0011";
    const city = process.env.WEATHER_CITY ?? "Karachi";

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise` +
      `&timezone=auto&forecast_days=4`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error("Open-Meteo request failed");

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const { label, icon } = weatherFromCode(current.weather_code);

    const forecast: WeatherForecast[] = daily.time.slice(1, 4).map(
      (dateStr: string, i: number) => {
        const dayIndex = i + 1;
        const code = daily.weather_code[dayIndex];
        const { icon: dayIcon } = weatherFromCode(code);
        const date = new Date(dateStr);
        const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });

        return {
          day: dayLabel,
          high: Math.round(daily.temperature_2m_max[dayIndex]),
          low: Math.round(daily.temperature_2m_min[dayIndex]),
          icon: dayIcon,
        };
      }
    );

    const weather: WeatherResponse = {
      city,
      temp: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      condition: label,
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      uv: uvLabel(current.uv_index ?? 0),
      sunrise: formatSunrise(daily.sunrise[0]),
      icon,
      forecast,
    };

    return NextResponse.json(weather);
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
