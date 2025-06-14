import { createContext, useState, ReactNode } from "react";
import type { Task as SupabaseTask } from "@turbo-with-tailwind-v4/supabase/types";

export interface TaskContextType {
  tasks: SupabaseTask[];
  setTasks: (tasks: SupabaseTask[]) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, selectedDate, setSelectedDate }}>
      {children}
    </TaskContext.Provider>
  );
};
