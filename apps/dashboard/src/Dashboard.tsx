import { Calendar } from "./components/calendar-full/calendar"
// import { ProductivitySection } from "./components/productivity/productivity-section"
import { WeatherSection } from "./components/weather/weather-section"
// import { SmartOverview } from "./components/smart-overview/smart-overview"
import Greeting from "./components/greeting/greeting"
import { DateTimeDisplay } from "./components/date-and-time"
import TodoList from "./components/tasks-prototype"
import { TaskProvider } from "./providers/task-provider"
//import { useAuth } from '@turbo-with-tailwind-v4/supabase'
import { useEffect } from 'react'
import { router } from './router'


export function Dashboard() {
  // const { user } = useAuth()
  // console.log('user', user)

  // useEffect(() => {
  //   if (!user) {
  //     router.navigate({ to: '/signin' })
  //   }
  // }, [user])

  // if (!user) return null

  return (
    <TaskProvider>
      <div className="min-h-screen p-4 md:p-6 w-full">
        <div className="grid grid-cols-5 gap-6 mx-auto">
          {/* Column 1: Greeting and Todo List */}
          <div className="flex flex-col space-y-6 col-span-3">
            <Greeting />
            <WeatherSection />
            <TodoList />
          </div>
          {/* Column 2: Date/Time, Weather, Pomodoro */}
          <div className="flex flex-col space-y-6 col-span-2">
            <DateTimeDisplay />
            <Calendar />
          </div>
        </div>
      </div>
    </TaskProvider>
  )
}

export default Dashboard
