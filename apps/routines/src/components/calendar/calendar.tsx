"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = [27, 28, 29, 30, 1, 2, 3]
  const [selectedDate, setSelectedDate] = useState(4) // 1 is selected (index 4)

  return (
    <div className="bg-[#1a2235] rounded-lg p-4 min-w-[280px]">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="text-gray-400 size-8">
          <ChevronLeft className="size-4" />
        </Button>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day, i) => (
            <div key={i} className="w-8 text-xs text-gray-400">
              {day}
            </div>
          ))}
          {dates.map((date, i) => (
            <Button
              key={i}
              variant="ghost"
              className={`w-8 h-8 p-0 ${
                i === selectedDate ? "bg-[#3b5bdb] text-white" : "text-gray-400 hover:bg-[#232b3d]"
              }`}
              onClick={() => setSelectedDate(i)}
            >
              {date}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 size-8">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
