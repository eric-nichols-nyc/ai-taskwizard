import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@turbo-with-tailwind-v4/design-system/button';
import { AddTaskSheet } from './components/add-task-sheet';
import { supabase, useAuth, signInWithEmail } from '@turbo-with-tailwind-v4/database';
import type { User } from '@supabase/supabase-js';
import { useAddTask, useDefaultKanban } from '@turbo-with-tailwind-v4/database/use-tasks';
import { ErrorBoundary } from '@turbo-with-tailwind-v4/design-system';
import { Card } from '@turbo-with-tailwind-v4/design-system';

console.log('[Calendar App] Environment:', import.meta.env);

// Debug: Log environment variables
// Types
interface Task {
  id: string;
  title: string;
  due_date: string;
  user_id: string;
  // ...other fields as needed
}

// Utility function to create date strings in local timezone
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const CalendarApp: React.FC = () => {

  const auth = useAuth();
  const user: User | null | undefined = auth?.user;

  // Get userId based on environment

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const[userId, setUserId] = useState<string | undefined>(undefined);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const addTaskMutation = useAddTask();
  const { data: kanbanData } = useDefaultKanban();
  const [view, setView] = useState<'month' | 'week'>('week');
  const [addTaskError, setAddTaskError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      console.log('** User id found', userId);
      fetchTasksForMonth();
    } else {
      console.log('** No user id found', userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, userId]);

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      async function maybeSignIn() {
        try {
          const sessionData = await signInWithEmail();
          setUserId(sessionData?.user?.id);
          console.log('Dev sign-in successful, user from session data:', sessionData?.user?.id);
        } catch (error) {
          console.error('Error during dev sign-in:', error);
        }
      }
      maybeSignIn();
    }
  }, []);

  // Handle task creation with proper column assignment and position calculation
  const handleAddTask = async (task: { title: string; description: string; priority: "Low" | "Medium" | "High" }) => {
    try {
      setAddTaskError(null);

      if (!kanbanData) {
        throw new Error('Kanban data not available');
      }

            // Find the Todo column
      const todoColumn = kanbanData.columns?.find(col => col.name === 'Todo');
      if (!todoColumn) {
        throw new Error('Todo column not found');
      }

      // Calculate position (last task + 1000)
      const todoTasks = kanbanData.tasks?.filter(task => task.column_id === todoColumn.id) || [];
      const maxPosition = todoTasks.length > 0
        ? Math.max(...todoTasks.map(t => t.position))
        : 0;
      const position = maxPosition + 1000;

      // Create complete task data
      const completeTaskData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: currentDate.toISOString().split('T')[0],
        column_id: todoColumn.id,
        status: 'todo',
        position,
      };

      await addTaskMutation.mutateAsync(completeTaskData);
      setIsAddTaskDialogOpen(false);
      fetchTasksForMonth();
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setAddTaskError((err as { message?: string }).message || 'Failed to add task');
      } else {
        setAddTaskError('Failed to add task');
      }
      throw err; // propagate to AddTaskSheet for local error display
    }
  };

  // Fetch all tasks for the current month
  const fetchTasksForMonth = async (): Promise<void> => {
    console.log('** Fetching tasks for month', userId);
    if (!supabase) return;

    // Create date range in local timezone
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDateStr = toLocalDateString(startOfMonth);
    const endDateStr = toLocalDateString(endOfMonth);

    console.log('[Calendar] Fetching tasks for', { userId, startDateStr, endDateStr });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('due_date', startDateStr)
        .lte('due_date', endDateStr);
      if (error) {
        console.error('[Calendar] Error fetching tasks:', error);
        alert('Error fetching tasks: ' + (error.message || error));
        setTasks([]);
        return;
      }
      if (data) {
        setTasks(data as Task[]);
        console.log('[Calendar] Tasks set:', data);
      } else {
        setTasks([]);
        console.warn('[Calendar] No tasks found for this month.');
      }
    } catch (err) {
      console.error('[Calendar] Unexpected error fetching tasks:', err);
      alert('Unexpected error fetching tasks: ' + (err instanceof Error ? err.message : String(err)));
      setTasks([]);
    }
  };

  const getDaysInMonth = (): (Date | null)[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getTasksForDate = (date: Date | null): Task[] => {
    if (!date) return [];

    // Create date string in local timezone to match database format
    const dateString = toLocalDateString(date);

    return tasks.filter(task => task.due_date === dateString);
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Helper to get week dates (Monday to Sunday)
  const getWeekDates = (date: Date): Date[] => {
    const week: Date[] = [];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    // Calculate Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  // Week navigation
  const navigateWeek = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction * 7);
      return newDate;
    });
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 calendar-month-title">
              {view === 'month'
                ? `${['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'][currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : (() => {
                    const start = getWeekDates(currentDate)[0];
                    const end = getWeekDates(currentDate)[6];
                    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  })()
              }
            </h1>
            <p className="text-sm text-gray-600">
              Today is {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* View toggle */}
          <Button onClick={() => setView('week')} disabled={view === 'week'} className={view === 'week' ? 'bg-blue-600 text-white' : ''}>Week</Button>
          <Button onClick={() => setView('month')} disabled={view === 'month'} className={view === 'month' ? 'bg-blue-600 text-white' : ''}>Month</Button>
          {/* Navigation */}
          {view === 'month' ? (
            <>
              <Button
                onClick={() => navigateMonth(-1)}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                ←
              </Button>
              <button
                onClick={() => navigateMonth(1)}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigateWeek(-1)}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                ←
              </Button>
              <button
                onClick={() => navigateWeek(1)}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </>
          )}
          <Button
            onClick={() => setIsAddTaskDialogOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      {/* Calendar Body Component */}
      <ErrorBoundary>
        {view === 'month' ? (
          <div className="bg-card rounded-lg shadow h-full flex flex-col">
            {/* Day headers - hidden on mobile */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-7 gap-px calendar-grid-gap calendar-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) => (
                <div
                  key={day}
                  className="px-3 py-2 text-center text-sm font-medium calendar-header-day"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar days */}
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-px calendar-grid-gap flex-1 min-h-[400px]">
              {getDaysInMonth().map((date: Date | null, index: number) => {
                const dayTasks: Task[] = getTasksForDate(date);
                const isToday: boolean = !!date && date.toDateString() === new Date().toDateString();
                return (
                  <Card
                    key={index}
                    className={`min-h-[220px] sm:min-h-0 flex flex-col p-1 sm:p-2 cursor-pointer transition-colors ${
                      isToday
                        ? 'calendar-today ring-2 ring-blue-500 border-blue-500'
                        : 'calendar-day'
                    }`}
                    style={{height: '100%', minHeight: '220px'}}
                  >
                    {date && (
                      <>
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${
                          isToday ? '' : ''
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          {dayTasks.slice(0, 3).map((task: Task) => (
                            <div
                              key={task.id}
                              className="calendar-event w-full block rounded-md border-l-4 px-3 py-1 text-xs font-medium mb-1 text-white"
                              style={{
                                borderLeftColor: '#3B82F6',
                                backgroundColor: 'rgba(19,19,22,0.7)',
                                color: '#fff'
                              }}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // Week view
          <div className="bg-card rounded-lg shadow h-full flex flex-col">
            {/* Removed day headers row for week view */}
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-px calendar-grid-gap flex-1 min-h-[400px]">
              {(() => {
                const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return getWeekDates(currentDate).map((date, index) => {
                  const dayTasks = getTasksForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <Card
                      key={index}
                      className={`min-h-[100px] sm:min-h-0 flex flex-col p-2 cursor-pointer transition-colors ${
                        isToday ? 'calendar-today ring-2 ring-blue-500 border-blue-500' : 'calendar-day'
                      }`}
                      style={{height: '100%', minHeight: '180px'}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">{weekDays[index]}</span>
                        <span className="text-xs font-medium">{date.getDate()}</span>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className="calendar-event w-full block rounded-md border-l-4 px-3 py-1 text-xs font-medium mb-1 text-white"
                            style={{
                              borderLeftColor: '#3B82F6',
                              backgroundColor: 'rgba(19,19,22,0.7)',
                              color: '#fff'
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </ErrorBoundary>
      <AddTaskSheet
        onAddTask={handleAddTask}
        open={isAddTaskDialogOpen}
        onOpenChange={(open) => {
          setIsAddTaskDialogOpen(open);
          if (!open) setAddTaskError(null);
        }}
        error={addTaskError}
      />
    </div>
  );
};