import { useState, ReactNode } from "react";
import { TaskContext } from "./task-context";

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <TaskContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </TaskContext.Provider>
  );
};
// useTaskContext has been moved to a separate file for Fast Refresh compatibility.