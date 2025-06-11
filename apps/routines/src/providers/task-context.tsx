import { createContext } from "react";

export interface TaskContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
