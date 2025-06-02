//import { Calendar } from "./components/calendar/calendar"
// import { ProductivitySection } from "./components/productivity/productivity-section"
import { WeatherSection } from "./components/weather/weather-section"
import { PomodoroSection } from "./components/features/pomodoro-section/pomodoro-app/pomodoro"
// import { SmartOverview } from "./components/smart-overview/smart-overview"
import Greeting from "./components/greeting/greeting"
import { DateTimeDisplay } from "./components/date-and-time"
import TodoList from "./components/tasks-prototype"

export function Dashboard() {
  return (
    <div className="min-h-screen p-4 md:p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
        {/* Column 1: Greeting and Todo List */}
        <div className="flex flex-col space-y-6">
          <Greeting />
          <TodoList />
        </div>
        {/* Column 2: Date/Time, Weather, Pomodoro */}
        <div className="flex flex-col space-y-6">
          <DateTimeDisplay />
          <WeatherSection />
          <PomodoroSection />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
