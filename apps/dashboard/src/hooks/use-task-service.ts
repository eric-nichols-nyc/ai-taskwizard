import { useState, useEffect } from "react";
import { useTaskContext } from "./use-task-context";
import { createTaskService } from "@turbo-with-tailwind-v4/supabase/task-service";
import type { Task as SupabaseTask } from "@turbo-with-tailwind-v4/supabase/types";
import { supabase } from '../supabaseClient'; // or wherever your client is

const taskService = createTaskService(supabase);

export const useTaskService = () => {
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const { selectedDate, setSelectedDate } = useTaskContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    taskService.getTasks()
      .then((tasks) => {
        console.log('Tasks:', tasks);
        setTasks(tasks);
      })
      .catch((err) => {
        // handle error (e.g., show toast)
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const createTask = async (taskData: SupabaseTask) => {
    setLoading(true);
    try {
      await taskService.createTask(taskData);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<SupabaseTask>) => {
    setLoading(true);
    try {
      await taskService.updateTask(taskId, updates);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await taskService.deleteTask(taskId);
    } finally {
      setLoading(false);
    }
  };

  // function triggered when user clicks on a day in the calendar
  const handleCalendarDayClick = (date: Date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getTasksForDate = (date: Date) => {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();

    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getFullYear() === targetYear &&
        taskDate.getMonth() === targetMonth &&
        taskDate.getDate() === targetDay
      );
    });
  };

  return {
    tasks,
    loading,
    selectedDate,
    setSelectedDate,
    createTask,
    updateTask,
    deleteTask,
    handleCalendarDayClick,
    getTasksForDate
  };
};