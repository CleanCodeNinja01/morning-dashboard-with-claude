"use client";

import { useEffect, useState } from "react";
import type { WeatherResponse } from "@/app/api/weather/route";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setWeather(data);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div className="card flex flex-col h-[300px] overflow-hidden">
      <p className="widget-label flex-shrink-0">Weather</p>

      {error && (
        <p className="text-sm text-gray-400">Could not load weather.</p>
      )}

      {!error && !weather && (
        <div className="flex-1 space-y-4 animate-pulse">
          <div className="h-12 bg-gray-100 rounded w-1/2" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="h-2 bg-gray-100 rounded w-full" />
        </div>
      )}

      {weather && (
        <div
          className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#E0E0E0 transparent",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-5xl font-semibold text-gray-900 leading-none">{weather.temp}°</p>
              <p className="text-sm text-gray-500 mt-2">
                {weather.condition} · {weather.city}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Feels like {weather.feels_like}°</p>
            </div>
            <span className="text-5xl leading-none">{weather.icon}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-gray-400 mb-1">Wind</p>
              <p className="text-sm font-medium text-gray-800">{weather.wind} km/h</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-gray-400 mb-1">UV Index</p>
              <p className="text-sm font-medium text-gray-800">{weather.uv}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-gray-400 mb-1">Sunrise</p>
              <p className="text-sm font-medium text-gray-800">{weather.sunrise}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400 w-16 flex-shrink-0">💧 Humidity</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-indigo-400 h-1.5 rounded-full"
                style={{ width: `${weather.humidity}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">{weather.humidity}%</span>
          </div>

          <div className="flex gap-0 pt-3 border-t border-gray-100">
            {weather.forecast.map((f) => (
              <div key={f.day} className="flex-1 text-center">
                <p className="text-xs text-gray-400">{f.day}</p>
                <p className="text-xl my-1">{f.icon}</p>
                <p className="text-xs font-medium text-gray-700">
                  {f.high}° <span className="text-gray-400">{f.low}°</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
