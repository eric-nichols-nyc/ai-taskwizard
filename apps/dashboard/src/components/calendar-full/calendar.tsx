"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskService } from "../../hooks/use-task-service";

export function Calendar() {
  const { tasks, handleCalendarDayClick, setSelectedDate, getTasksForDate } =
    useTaskService();

  // useEffect(() => {
  //   // console.log("DEBUG: tasks in Calendar", tasks);
  // }, [tasks]);

  // Get today's date
  const today = new Date();

  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  // Month and days
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Calculate first day of the month (0=Sunday)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Calculate number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Prepare calendar grid: add empty slots for days before the 1st
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getTaskStatsForDay = (day: number) => {
    if (!day) return { total: 0, completed: 0 };
    const date = new Date(currentYear, currentMonth, day, 12, 0, 0, 0);
    const dayTasks = getTasksForDate(date);
    // // console.log("DEBUG: getTaskStatsForDay", { date, dayTasks });
    const total = dayTasks.length;
    const completed = dayTasks.filter((task) => task.completed).length;
    return { total, completed };
  };

  // Handlers for month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  // function triggered when user clicks on a day in the calendar
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day, 12, 0, 0, 0);
    // // console.log("DEBUG: handleDayClick", clickedDate);
    setSelectedDate(clickedDate);
    setSelectedDay(day);
    handleCalendarDayClick(clickedDate);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-card min-h-[600px]">
      <div className="w-full rounded-lg p-6 shadow-xl">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="text-gray-400 hover:text-white"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={goToNextMonth}
          >
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
              return <div key={"empty-" + idx} />;
            }
            const { total, completed } = getTaskStatsForDay(date);
            const isSelected = date === selectedDay;
            const isToday =
              date === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={date}
                onClick={() => handleDayClick(date)}
                className={`
                relative min-h-[5rem] p-3 rounded-lg cursor-pointer
                transition-all duration-200 border
                ${
                  isSelected
                    ? "ring-2 ring-blue-400 bg-blue-800/90 border-blue-400"
                    : "bg-slate-700/50 hover:bg-slate-700 border-slate-600 hover:border-slate-500"
                }
                ${isToday ? "ring-1 ring-green-400" : ""}
              `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-base font-medium ${
                      isToday ? "text-green-400" : "text-white"
                    }`}
                  >
                    {date}
                  </span>
                </div>
                {/* Event indicator */}
                {total > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-1.5 bg-gray-600 rounded-full mb-2">
                      <div
                        className="h-1.5 bg-green-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-center text-gray-300 font-medium">
                      {completed}/{total} items
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
