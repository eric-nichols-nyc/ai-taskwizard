import * as React from "react"
import { Card } from "@turbo-with-tailwind-v4/design-system/card"
import quotes from "./quotes.json"
import weather from "../../assets/weather.json"

function toMinutes(timeStr: string) {
  // Handles "hh:mm AM/PM"
  const [time, modifier] = timeStr.split(' ')
  const [h, minutes] = time.split(':').map(Number)
  let hours = h
  if (modifier === 'PM' && hours !== 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

function getTimeOfDay(localtime: string, sunrise: string, sunset: string) {
  const [, time] = localtime.split(' ')
  const [h, minutes] = time.split(':').map(Number)
  const localMinutes = h * 60 + minutes
  const sunriseMinutes = toMinutes(sunrise)
  const sunsetMinutes = toMinutes(sunset)

  if (localMinutes < sunriseMinutes) return "night"
  if (localMinutes < 12 * 60) return "morning"
  if (localMinutes < sunsetMinutes) return "afternoon"
  return "evening"
}

const Greeting = () => {
  const randomQuote = React.useMemo(() => {
    const arr = quotes as { quote: string; author: string }[]
    const idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
  }, [])

  // Get weather data
  const { localtime } = weather.location
  const { sunrise, sunset } = weather.current.astro
  const weatherIcon = weather.current.weather_icons[0]
  const timeOfDay = getTimeOfDay(localtime, sunrise, sunset)

  return (
    <Card className="flex flex-col bg-[#1a2235] text-white border-none p-2">
      <div className="flex items-center mb-2">
        <img src={weatherIcon} alt="Weather" className="w-8 h-8 mr-2" />
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