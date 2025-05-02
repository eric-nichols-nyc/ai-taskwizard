import { Calendar } from "./components/calendar/calendar"
// import { ProductivitySection } from "./components/productivity/productivity-section"
// import { UpcomingSection } from "./components/upcoming/upcoming-section"
// import { TasksSection } from "./components/tasks/tasks-section"
import { WeatherSection } from "./components/weather/weather-section"
import { PomodoroSection } from "./components/features/pomodoro-section/pomodoro-app/pomodoro"
import { SmartOverview } from "./components/smart-overview/smart-overview"
import PomodoroTimer  from "./components/features/pomodoro-prototype/pomodoro-section"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0f1420] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with greeting and calendar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Good morning, Eric</h1>
            <p className="text-gray-400 mt-1">
              "You cannot escape the responsibility of tomorrow by evading it today." - Abraham Lincoln
            </p>
          </div>
          <Calendar />
        </div>

        {/* Smart Overview */}
        <SmartOverview />

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* <ProductivitySection />
            <UpcomingSection />
            <TasksSection /> */}
            <PomodoroTimer />
          </div>
          <div className="space-y-6">
            <WeatherSection />
            <PomodoroSection />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
