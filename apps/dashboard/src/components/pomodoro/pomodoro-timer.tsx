"use client"

import { Button } from "../ui/button"
import { Timer, Plus } from "lucide-react"
import { Timer as TimerType } from "../../types"
import { useTimer } from "../../hooks/use-timer"
import { formatTime } from "../../lib/utils"


export function PomodoroTimer({ setTimer }: { setTimer: (timer: TimerType) => void }) {

  const {
    startTimer,
    pauseTimer,
    resetTimer,
    time,
    isRunning,
  } = useTimer()


  return (
    <div className="rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="size-5 " />
          <h2 className="text-xl font-semibold ">Pomodoro</h2>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700  rounded-full" onClick={() => {
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
          <Button className="bg-green-500 hover:bg-green-600  rounded-full px-6" onClick={startTimer} disabled={isRunning || time === 0}>Start</Button>
          <Button variant="outline" className="bg-gray-600 hover:bg-gray-700  border-none rounded-full px-6" onClick={pauseTimer} disabled={!isRunning}>Pause</Button>
          <Button variant="outline" className="bg-red-500 hover:bg-red-600  border-none rounded-full px-6" onClick={resetTimer}>Reset</Button>
        </div>
      </div>
    </div>
  )
}
