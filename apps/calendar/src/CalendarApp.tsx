import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@turbo-with-tailwind-v4/design-system/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@turbo-with-tailwind-v4/design-system/dialog';
import { supabase, useAuth, signInWithGoogle } from '@turbo-with-tailwind-v4/database';
import type { SupabaseClient, User } from '@supabase/supabase-js';

// Debug: Log environment variables
// Types
interface Task {
  id: string;
  title: string;
  due_date: string;
  user_id: string;
  // ...other fields as needed
}

const TaskForm: React.FC<{ onCancel: () => void; onSubmit: () => void }> = ({ onCancel, onSubmit }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right">
            Title
          </label>
          <input id="title" placeholder="Enter task" className="col-span-3 p-2 border rounded" />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</Button>
        <Button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Task</Button>
      </DialogFooter>
    </form>
  );
};

const IS_DEV = window.location.href.includes(
  import.meta.env.VITE_DEV_URL
);
// Initialize Supabase client once, outside the component
let supabaseClient: SupabaseClient | undefined = undefined;
if (typeof window !== 'undefined' && window.location.href.includes(import.meta.env.VITE_DEV_URL)) {
  supabaseClient = supabase;
}

export const CalendarApp: React.FC = () => {
  const auth = useAuth();
  const user: User | null | undefined = auth?.user;

  // Get userId based on environment

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const[userId, setUserId] = useState<string | undefined>(undefined);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  useEffect(() => {
    console.log('IS_DEV', IS_DEV);
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchTasksForMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, userId]);

  useEffect(() => {
    if (IS_DEV && supabaseClient) {
      async function maybeSignInWithGoogle() {
        try {
          const session = await signInWithGoogle();
          setUserId(session?.user?.id);
          console.log('user from session data', userId);
        } catch (error) {
          console.error('Error during Google sign-in:', error);
        }
      }
      maybeSignInWithGoogle();
    }
  }, [supabaseClient]);

  // Fetch all tasks for the current month
  const fetchTasksForMonth = async (): Promise<void> => {
    if (!userId) {
      console.log('No user id found');
      return;
    }
    if (!supabaseClient) return;
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDateStr = startOfMonth.toISOString().split('T')[0];
    const endDateStr = endOfMonth.toISOString().split('T')[0];
    console.log('[Calendar] Fetching tasks for', { userId, startDateStr, endDateStr });
    try {
      const { data, error } = await supabaseClient
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
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.due_date === dateString);
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
      <div className="w-full mx-auto p-6">
        {/* Header Component */}
        {
          user ? (
            <div>
              <div>Email: {user.email}</div>
            </div>
          ) : (
            <div>No User Found</div>
          )
        }
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 calendar-month-title">
                {['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'][currentDate.getMonth()]} {currentDate.getFullYear()}
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
        <div className="bg-card rounded-lg shadow">
          {/* Day headers */}
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
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-px calendar-grid-gap">
            {getDaysInMonth().map((date: Date | null, index: number) => {
              const dayTasks: Task[] = getTasksForDate(date);
              const isToday: boolean = !!date && date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={index}
                  className={`min-h-[60px] sm:min-h-[100px] md:min-h-[140px] p-1 sm:p-2 cursor-pointer transition-colors ${
                    isToday
                      ? 'calendar-today'
                      : 'calendar-day'
                  }`}
                  onClick={() => {}} // Placeholder for event popover
                >
                  {date && (
                    <>
                      <div className={`text-xs sm:text-sm font-medium mb-1 ${
                        isToday ? '' : ''
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="flex flex-col gap-1">
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
                </div>
              );
            })}
          </div>
        </div>
        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new task to your calendar.
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              onSubmit={() => {
                console.log('Form submitted');
                setIsAddTaskDialogOpen(false);
              }}
              onCancel={() => setIsAddTaskDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
  );
};