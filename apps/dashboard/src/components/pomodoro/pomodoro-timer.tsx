"use client"

import { useState, useRef } from "react"
import { Button } from "../ui/button"
import { Timer, Plus } from "lucide-react"
import { Timer as TimerType } from "../../types"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function PomodoroTimer({ setTimer }: { setTimer: (timer: TimerType) => void }) {
  const initialTime = 25 * 60
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = () => {
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev > 0) return prev - 1
          clearInterval(intervalRef.current as NodeJS.Timeout)
          setIsRunning(false)
          return 0
        })
      }, 1000)
    }
  }

  const pause = () => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const reset = () => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTime(initialTime)
  }

  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="size-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Pomodoro</h2>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full" onClick={() => {
          const newTimer: TimerType = {
            id: Date.now(),
            name: "New Timer",
            time: formatTime(time)
          };
          setTimer(newTimer);
        }}>
          <Plus className="size-4 mr-1" />
          New Timer
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-purple-400 my-4" data-testid="timer-display">{formatTime(time)}</div>

        <div className="flex gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6" onClick={start} disabled={isRunning || time === 0}>Start</Button>
          <Button variant="outline" className="bg-gray-600 hover:bg-gray-700 text-white border-none rounded-full px-6" onClick={pause} disabled={!isRunning}>Pause</Button>
          <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-6" onClick={reset}>Reset</Button>
        </div>
      </div>
    </div>
  )
}
