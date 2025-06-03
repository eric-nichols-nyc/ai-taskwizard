import { useState, useEffect } from "react";
import { taskService } from "../service/mock-supabase-service";
import { CreateTaskData, TaskFields, UpdateTaskData } from "../types";
import { useTaskContext } from "./use-task-context";

export const useTaskService = () => {
  const [tasks, setTasks] = useState<TaskFields[]>([]);
  const { selectedDate, setSelectedDate } = useTaskContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = taskService.subscribe(setTasks);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = taskService.subscribe((updatedTasks) => {
      setTasks(updatedTasks);
    });

    setTasks(taskService.getAllTasks());
    return unsubscribe;
  }, []);

  const createTask = async (taskData: CreateTaskData) => {
    setLoading(true);
    try {
      await taskService.createTask(taskData);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: UpdateTaskData) => {
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
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
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
    getTasksForDate,
    getTasksByPriority: taskService.getTasksByPriority.bind(taskService),
    getCompletedTasks: taskService.getCompletedTasks.bind(taskService),
    getPendingTasks: taskService.getPendingTasks.bind(taskService),
  };
};