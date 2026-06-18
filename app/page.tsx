import ClockWidget from "@/components/ClockWidget";
import WeatherWidget from "@/components/WeatherWidget";
import TasksWidget from "@/components/TasksWidget";
import QuoteWidget from "@/components/QuoteWidget";
import NewsWidget from "@/components/NewsWidget";
import EmailWidget from "@/components/EmailWidget";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ClockWidget />
          <WeatherWidget />
          <EmailWidget />
          <TasksWidget />
          <QuoteWidget />
          <NewsWidget />
        </div>
      </div>
    </main>
  );
}
