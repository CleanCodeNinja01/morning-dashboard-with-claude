import HeroWidget from "@/components/HeroWidget";
import WeatherWidget from "@/components/WeatherWidget";
import EmailWidget from "@/components/EmailWidget";
import CalendarWidget from "@/components/CalendarWidget";
import TasksWidget from "@/components/TasksWidget";
import WorldNewsWidget from "@/components/WorldNewsWidget";
import TechNewsWidget from "@/components/TechNewsWidget";
import StocksWidget from "@/components/StocksWidget";
import RitualsWidget from "@/components/RitualsWidget";
import GoalsWidget from "@/components/GoalsWidget";
import HabitTrackerWidget from "@/components/HabitTrackerWidget";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Row 1: Hero (full width) */}
          <HeroWidget />

          {/* Row 2: Weather + Inbox */}
          <WeatherWidget />
          <EmailWidget />

          {/* Row 3: Calendar + Tasks */}
          <CalendarWidget />
          <TasksWidget />

          {/* Row 4: World News + Tech/AI News */}
          <WorldNewsWidget />
          <TechNewsWidget />

          {/* Row 5: Stocks + Daily Rituals */}
          <StocksWidget />
          <RitualsWidget />

          {/* Row 6: Goals + Habit Tracker */}
          <GoalsWidget />
          <HabitTrackerWidget />
        </div>
      </div>
    </main>
  );
}
