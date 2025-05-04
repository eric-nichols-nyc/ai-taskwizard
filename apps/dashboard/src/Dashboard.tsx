import { Calendar } from "./components/calendar/calendar"
import { ProductivitySection } from "./components/productivity/productivity-section"
import { UpcomingSection } from "./components/upcoming/upcoming-section"
import { TasksSection } from "./components/tasks/tasks-section"
import { WeatherSection } from "./components/weather/weather-section"
import { PomodoroSection } from "./components/features/pomodoro-section/pomodoro-app/pomodoro"
import { SmartOverview } from "./components/smart-overview/smart-overview"
import Greeting from "./components/greeting/greeting"
// import PomodoroTimer  from "./components/features/pomodoro-prototype/pomodoro-section"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0f1420] text-white p-4 md:p-6 w-full">
      <div className="mx-auto space-y-6">
        {/* Header with greeting and calendar */}
        <div className="flex md:flex-row justify-between items-start md:items-center gap-4">
          <Greeting />
          <Calendar />
        </div>

        {/* Smart Overview */}
        <SmartOverview />

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProductivitySection />
            <UpcomingSection />
            <TasksSection />
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
