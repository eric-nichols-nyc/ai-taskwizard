// import React from "react";
import { Card, CardContent } from "@turbo-with-tailwind-v4/design-system/card";

// Helper to get the start of the current week (Sunday)
function getStartOfWeek(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

// Helper to get all days in the current week (Sunday to Saturday)
function getCurrentWeekDays() {
  const startOfWeek = getStartOfWeek(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

// Helper to format week range, e.g., 'Jun 30 - Jul 6, 2025'
function formatWeekRange(weekDays: Date[]) {
  if (weekDays.length === 0) return "";
  const start = weekDays[0];
  const end = weekDays[6];
  const startMonth = start.toLocaleString("default", { month: "short" });
  const endMonth = end.toLocaleString("default", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
}

export const CalendarApp = () => {
  const weekDays = getCurrentWeekDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayString = new Date().toDateString();
  const weekRange = formatWeekRange(weekDays);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-center text-gray-700 dark:text-gray-200 mb-2">
          {weekRange}
        </div>
        <div className="w-full grid grid-cols-7 gap-2">
          {weekDays.map((date, idx) => {
            const isToday = date.toDateString() === todayString;
            return (
              <Card
                key={idx}
                className={`border rounded-md p-3 text-center dark:bg-gray-900 transition-all duration-150
                  ${isToday ?
                    "border-blue-600 bg-blue-100 dark:bg-blue-900 shadow-lg" : ""
                  }`
                }
                aria-current={isToday ? "date" : undefined}
              >
                <div className="font-bold mb-1 text-sm md:text-base">{dayNames[date.getDay()]}</div>
                <div className={`text-xl md:text-2xl ${isToday ? "font-extrabold text-blue-700 dark:text-blue-200" : ""}`}>
                  {date.getDate()}
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// For compatibility, keep the original Calendar export as an alias
export const Calendar = CalendarApp;