// import React from "react";

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

export const CalendarApp = () => {
  const weekDays = getCurrentWeekDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
      {weekDays.map((date, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: 12,
            textAlign: "center",
            background: date.toDateString() === new Date().toDateString() ? "#f3f4f6" : "#fff",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{dayNames[date.getDay()]}</div>
          <div style={{ fontSize: 20 }}>{date.getDate()}</div>
        </div>
      ))}
    </div>
  );
};

// For compatibility, keep the original Calendar export as an alias
export const Calendar = CalendarApp;