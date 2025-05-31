import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X } from 'lucide-react';

// Types
interface Event {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  color: string;
  userId: string;
  isAllDay: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  endDate: string;
  color: string;
}

interface SupabaseResponse<T> {
  data: T[] | null;
  error: unknown | null;
}

// Mock Supabase client - replace with actual Supabase initialization
const supabase = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  from: (_table: string) => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select: (_columns?: string) => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      eq: (_column: string, _value: string) => Promise.resolve({ data: [] as Event[], error: null })
    }),
    insert: (data: Event[]) => Promise.resolve({ data: data, error: null }),
    update: (data: Partial<Event>) => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      eq: (_column: string, _value: string) => Promise.resolve({ data: [data], error: null })
    }),
    delete: () => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      eq: (_column: string, _value: string) => Promise.resolve({ error: null })
    })
  })
};

export const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventPopover, setShowEventPopover] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    endDate: new Date().toISOString().split('T')[0],
    color: '#10B981'
  });

  // Mock user ID - replace with actual authentication
  const userId: string = 'kxR3TTSxxEcOwQ1w6hKZhDl7ZZz1';

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async (): Promise<void> => {
    // const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // In a real app, you'd filter by date range and userId
    const { data, error }: SupabaseResponse<Event> = await supabase
      .from('events')
      .select('*')
      .eq('userId', userId);
    
    if (!error && data) {
      setEvents(data);
    }
  };

  const createEvent = async (): Promise<void> => {
    if (!formData.title.trim()) return;
    
    const eventData: Event = {
      title: formData.title,
      description: '',
      startDate: new Date(selectedDate || new Date()).toISOString(),
      endDate: new Date(formData.endDate + 'T23:59:59').toISOString(),
      color: formData.color,
      userId: userId,
      isAllDay: true,
      type: 'event',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _data, error } = await supabase
      .from('events')
      .insert([eventData]);

    if (!error) {
      setEvents([...events, eventData]);
      setFormData({
        title: '',
        endDate: new Date().toISOString().split('T')[0],
        color: '#10B981'
      });
      setShowEventPopover(false);
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null): Event[] => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Get the date parts without time for comparison
      const eventStartDate = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const eventEndDate = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Check if the current date falls within the event's date range
      return currentDate >= eventStartDate && currentDate <= eventEndDate;
    });
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const openEventPopover = (date: Date | null = null): void => {
    setSelectedDate(date);
    setShowEventPopover(true);
  };

  const monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full mx-auto p-6">
      {/* Header Component */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 calendar-month-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
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
          <button
            onClick={() => navigateMonth(-1)}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            →
          </button>
          <button
            onClick={() => openEventPopover()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Body Component */}
      <div className="bg-card rounded-lg shadow">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px calendar-grid-gap calendar-header">
          {dayNames.map((day: string) => (
            <div
              key={day}
              className="px-3 py-2 text-center text-sm font-medium calendar-header-day"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px calendar-grid-gap">
          {getDaysInMonth().map((date: Date | null, index: number) => {
            const dayEvents: Event[] = date ? getEventsForDate(date) : [];
            const isToday: boolean = !!date && date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[140px] p-2 cursor-pointer transition-colors ${
                  isToday 
                    ? 'calendar-today'
                    : 'calendar-day'
                }`}
                onClick={() => date && openEventPopover(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? '' : ''
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event: Event, eventIndex: number) => (
                        <div
                          key={eventIndex}
                          className="calendar-event"
                          style={event.color ? { backgroundColor: event.color, color: '#fff' } : {}}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{dayEvents.length - 3} more
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

      {/* Event Creation Popover */}
      {showEventPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Event
              </h3>
              <button
                onClick={() => setShowEventPopover(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  {['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'].map((color: string) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Select color ${color}`}
                      onClick={() => setFormData({...formData, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventPopover(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createEvent}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};