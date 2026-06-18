const weather = {
  city: "Karachi",
  country: "PK",
  temp: 34,
  feels_like: 38,
  condition: "Sunny",
  humidity: 62,
  wind: 14,
  icon: "☀️",
  forecast: [
    { day: "Tomorrow", high: 35, low: 28, icon: "⛅" },
    { day: "Thu", high: 33, low: 27, icon: "🌤️" },
    { day: "Fri", high: 31, low: 26, icon: "🌧️" },
  ],
};

export default function WeatherWidget() {
  return (
    <div className="card">
      <p className="widget-label">Weather</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-5xl font-bold text-gray-900">{weather.temp}°C</p>
          <p className="text-gray-500 mt-1">{weather.condition}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {weather.city}, {weather.country}
          </p>
        </div>
        <span className="text-6xl">{weather.icon}</span>
      </div>
      <div className="flex gap-3 mt-4 text-sm text-gray-500">
        <span>💧 {weather.humidity}%</span>
        <span>💨 {weather.wind} km/h</span>
        <span>Feels {weather.feels_like}°C</span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
        {weather.forecast.map((f) => (
          <div key={f.day} className="flex-1 text-center">
            <p className="text-xs text-gray-400">{f.day}</p>
            <p className="text-xl my-1">{f.icon}</p>
            <p className="text-xs font-medium text-gray-700">{f.high}° <span className="text-gray-400">{f.low}°</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
