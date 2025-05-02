"use client"

import { Timer } from "lucide-react"
import { TimerItem } from "./TimerItem"


type Timer = {
  id: number
  name: string
  time: string
}

export function TimersList({ timers }: { timers: Timer[] }) {


  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="size-5 text-white" />
        <h2 className="text-xl font-semibold text-white">Timers</h2>
      </div>

      <div className="space-y-3">
        {timers.map((timer) => (
          <TimerItem key={timer.id} timer={timer} />
        ))}
      </div>
    </div>
  )
}
