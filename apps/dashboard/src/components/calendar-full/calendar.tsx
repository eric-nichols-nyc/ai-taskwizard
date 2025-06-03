"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState(3)

  // Calendar data for June 2025
  const month = "June 2025"
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  // Create calendar grid with 6 rows (including header) and 7 columns
  const dates = Array.from({ length: 30 }, (_, i) => i + 1)

  // Events data
  const events: Record<number, { count: number; color: string }> = {
    3: { count: 2, color: "bg-amber-400" },
    11: { count: 1, color: "bg-amber-400" },
    18: { count: 1, color: "bg-amber-400" },
  }

  return (
    <div className="flex items-center justify-center bg-card min-h-[600px]">
      <div className="w-full rounded-lg p-6 shadow-xl">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-gray-400 hover:text-white">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">{month}</h2>
          <button className="text-gray-400 hover:text-white">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-gray-400 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date) => {
            const hasEvent = date in events
            const isSelected = date === selectedDate

            return (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`
                  relative min-h-[4rem] sm:min-h-[5rem]
                  p-1 rounded-md cursor-pointer
                  bg-blue-900/40 hover:bg-blue-900/90
                  border border-blue-800
                  ${isSelected ? "ring-2 ring-blue-400 bg-blue-800/90 border-blue-400" : ""}
                  transition-colors duration-150
                `}
              >
                <span className="text-white text-sm">{date}</span>

                {/* Event indicator */}
                {hasEvent && (
                  <div className="absolute bottom-2 left-0 right-0 px-1">
                    <div className={`h-1 w-3/4 mx-auto ${events[date].color} rounded-full mb-1`}></div>
                    <div className="text-[10px] text-center text-amber-400">
                      {events[date].count} {events[date].count === 1 ? "item" : "items"}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
