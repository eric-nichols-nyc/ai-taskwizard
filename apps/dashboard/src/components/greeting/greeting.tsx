import * as React from "react"
import { Card } from "@turbo-with-tailwind-v4/design-system/card"
import quotes from "./quotes.json"
import { useWeatherStore } from "../../stores/weatherStore"
import { Sun, Cloud } from "lucide-react"

function getTimeOfDay(localtime?: string | null) {
  if (!localtime) return "day"
  const [, time] = localtime.split(' ')
  const [h, minutes] = time.split(':').map(Number)
  const localMinutes = h * 60 + minutes
  if (localMinutes < 6 * 60) return "night"
  if (localMinutes < 12 * 60) return "morning"
  if (localMinutes < 18 * 60) return "afternoon"
  return "evening"
}

const Greeting = () => {
  const randomQuote = React.useMemo(() => {
    const arr = quotes as { quote: string; author: string }[]
    const idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
  }, [])

  const { weather, localtime } = useWeatherStore()
  const timeOfDay = getTimeOfDay(localtime)
  let weatherIcon: React.ReactNode = <Sun className="w-8 h-8 mr-2 text-yellow-400" />
  if (weather?.weather_icons?.[0]) {
    weatherIcon = <img src={weather.weather_icons[0]} alt="Weather" className="w-8 h-8 mr-2" />
  } else if (weather?.weather_descriptions?.[0]?.toLowerCase().includes('cloud')) {
    weatherIcon = <Cloud className="w-8 h-8 mr-2 text-gray-400" />
  }

  return (
    <Card className="flex flex-col bg-[#1a2235] text-white border-none p-2">
      <div className="flex items-center mb-2">
        {weatherIcon}
        <h1 className="text-3xl font-bold text-white">
          Welcome, Good {timeOfDay}.
        </h1>
      </div>
      <p className="text-gray-400 mt-1 italic text-sm">
        "{randomQuote.quote}" <span className="text-blue-400">- {randomQuote.author}</span>
      </p>
    </Card>
  )
}

export default Greeting 