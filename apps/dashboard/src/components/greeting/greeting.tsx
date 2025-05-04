import * as React from "react"
import { Card } from "@turbo-with-tailwind-v4/design-system/card"
import quotes from "./quotes.json"
import { useWeatherStore } from "../../stores/weatherStore"
import { Cloud } from "lucide-react"
import { WeatherIcon } from "../weather-icon"
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

  return (
    <Card className="flex flex-col flex-grow bg-[#1a2235] text-white border-none p-2">
      <div className="flex items-center mb-2 gap-2">
        {typeof weather?.weather_descriptions?.[0] === 'string' ? WeatherIcon(weather.weather_descriptions[0]) : <Cloud />}
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