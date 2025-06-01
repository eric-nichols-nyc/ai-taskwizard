"use client"

import { useState, useEffect } from "react"
export function Notes() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Set launch date to 30 days from now
  useEffect(() => {
    const launchDate = new Date()
    launchDate.setDate(launchDate.getDate() + 30)

    const timer = setInterval(() => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-4 text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-[-1] bg-gradient-animated" />

      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Coming Soon</h1>
        <p className="mb-8 text-lg text-gray-200">We're working hard to bring you something amazing.</p>

        {/* Countdown timer */}
        <div className="mb-10 grid grid-cols-4 gap-2 rounded-lg bg-black/20 p-4 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.days}</span>
            <span className="text-xs uppercase">Days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.hours}</span>
            <span className="text-xs uppercase">Hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.minutes}</span>
            <span className="text-xs uppercase">Minutes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.seconds}</span>
            <span className="text-xs uppercase">Seconds</span>
          </div>
        </div>
        {/* Social links */}
      </div>
    </main>
  )
}
