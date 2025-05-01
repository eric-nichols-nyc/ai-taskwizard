"use client"

import { Button } from "../ui/button"
import { Timer, Play, RotateCcw, Edit, Trash2 } from "lucide-react"

export function TimersSection() {
  const timers = [
    { id: 1, name: "Focus Block", time: "01:00" },
    { id: 2, name: "Focus Block", time: "25:00" },
  ]

  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="size-5 text-white" />
        <h2 className="text-xl font-semibold text-white">Timers</h2>
      </div>

      <div className="space-y-3">
        {timers.map((timer) => (
          <div key={timer.id} className="flex items-center justify-between bg-[#232b3d] rounded-lg p-3">
            <div>
              <div className="text-sm text-gray-400">{timer.name}</div>
              <div className="text-xl font-bold text-purple-400">{timer.time}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" className="size-8 rounded-full bg-green-500 hover:bg-green-600">
                <Play className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" className="size-8 rounded-full text-gray-400">
                <RotateCcw className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" className="size-8 rounded-full text-gray-400">
                <Edit className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" className="size-8 rounded-full text-gray-400">
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
