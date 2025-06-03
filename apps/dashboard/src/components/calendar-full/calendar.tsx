"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTaskService } from "../../hooks/use-task-service"

export function Calendar() {

  const {tasks}=useTaskService()

  useEffect(() => {
    console.log('tasks', tasks)
  }, [tasks])

  // Get today's date
  const today = new Date()

  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()) // 0-indexed
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today.getDate())

  // Month and days
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  // Calculate first day of the month (0=Sunday)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  // Calculate number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Prepare calendar grid: add empty slots for days before the 1st
  const calendarDays = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Events data (example)
  const events: Record<number, { count: number; color: string }> = {
    3: { count: 2, color: "bg-amber-400" },
    11: { count: 1, color: "bg-amber-400" },
    18: { count: 1, color: "bg-amber-400" },
  }

  // Handlers for month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prevMonth - 1
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prevMonth + 1
    })
  }

  return (
    <div className="flex items-center justify-center bg-card min-h-[600px]">
      <div className="w-full rounded-lg p-6 shadow-xl">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-gray-400 hover:text-white" onClick={goToPreviousMonth}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">{monthNames[currentMonth]} {currentYear}</h2>
          <button className="text-gray-400 hover:text-white" onClick={goToNextMonth}>
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
          {calendarDays.map((date, idx) => {
            if (date === null) {
              return <div key={"empty-" + idx} />
            }
            const hasEvent = date in events
            const isSelected = date === selectedDate

            return (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`
                bg-gray-800 text-gray-300 border border-gray-700/60 shadow-lg shadow-black/20 p-1.5 text-xs sm:text-sm flex flex-col items-start justify-start min-h-[4rem] sm:min-h-[5rem] rounded-md transition-all duration-150 hover:shadow-md cursor-pointer hover:bg-gray-700
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
