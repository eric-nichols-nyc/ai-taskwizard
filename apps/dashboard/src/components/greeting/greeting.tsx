import * as React from "react"
import { Card } from "@turbo-with-tailwind-v4/ui/card"
import quotes from "./quotes.json"
import { useWeatherStore } from "../../stores/weatherStore"
import { Cloud } from "lucide-react"
import { WeatherIcon } from "../weather-icon"
import { getTimeOfDay } from "../../lib/utils"

export const Greeting = () => {
  const randomQuote = React.useMemo(() => {
    const arr = quotes as { quote: string; author: string }[]
    const idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
  }, [])

  const { weather } = useWeatherStore()

  // Get user's current local time in the same format as weather API
  const now = new Date();
  const localDate = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const localTime = now.toTimeString().slice(0, 5); // "HH:mm"
  const localtime = `${localDate} ${localTime}`;
  const timeOfDay = getTimeOfDay(localtime)

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center mb-2 gap-2">
        {typeof weather?.weather_descriptions?.[0] === 'string' ? WeatherIcon(weather.weather_descriptions[0]) : <Cloud />}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          Welcome, Good {timeOfDay}.
        </h1>
      </div>
      <p className="mt-1 italic text-sm">
        "{randomQuote.quote}" <span className="text-blue-400">- {randomQuote.author}</span>
      </p>
    </Card>
  )
}