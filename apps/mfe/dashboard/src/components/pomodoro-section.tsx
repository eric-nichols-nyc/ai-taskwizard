"use client"

// import { useState } from "react"
import { Button } from "./ui/button"
import { Timer, Plus } from "lucide-react"

export function PomodoroSection() {
  // const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="size-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Pomodoro</h2>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
          <Plus className="size-4 mr-1" />
          New Timer
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-purple-400 my-4">25:00</div>

        <div className="flex gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6">Start</Button>
          <Button variant="outline" className="bg-gray-600 hover:bg-gray-700 text-white border-none rounded-full px-6">
            Pause
          </Button>
          <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-6">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
