import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// This would typically come from your database
const dummyEvents = {
  '2025-04-27': [{ id: 1, title: 'workout', color: 'pink' }],
  '2025-05-01': [
    { id: 2, title: 'move-in', color: 'red' },
    { id: 3, title: 'eat seafood', color: 'red' },
    { id: 4, title: 'go to the gym', color: 'red' }
  ],
  '2025-05-09': [{ id: 5, title: 'get a haircut', color: 'blue' }]
};

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)); // May 2025
  const [view, setView] = useState('month');
  const [events] = useState(dummyEvents);

  // Function to navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Function to navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Function to go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return (events as Record<string, { id: number; title: string; color: string; }[]>)[dateStr] || [];
  };

  // Function to render the month view
  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(monthEnd);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }

    const rows = [];
    let days = [];
    const day = new Date(startDate);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Create header row with day names and dates
    const headerRow = daysOfWeek.map((dayName, i) => {
      // Calculate the date for this column
      const headerDate = new Date(startDate);
      headerDate.setDate(startDate.getDate() + i);

      return (
        <div key={`header-${i}`} className="py-2 text-center text-gray-400 text-sm">
          {dayName} {headerDate.getDate()}
        </div>
      );
    });

    // Create calendar grid
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const dateStr = formatDate(cloneDay);
        const dayEvents = getEventsForDate(cloneDay);
        const isToday = formatDate(new Date()) === dateStr;
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();

        days.push(
          <div
            key={dateStr}
            className={`relative h-32 border border-gray-800 p-1 ${isCurrentMonth ? '' : 'bg-gray-900 text-gray-500'}`}
          >
            <div className="text-right">
              <span className={`inline-block ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto' : ''}`}>
                {day.getDate()}
              </span>
            </div>
            <div className="mt-1">
              {dayEvents.map((event: {title: string, color: string}, idx: number) => (
                <div
                  key={`${dateStr}-${idx}`}
                  className={`text-xs mb-1 py-1 px-1 truncate ${event.color === 'red' ? 'text-red-400 border-l-2 border-red-400' : event.color === 'pink' ? 'text-pink-400 border-l-2 border-pink-400' : 'text-blue-400 border-l-2 border-blue-400'}`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div key={day.getTime()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-0 mb-1">
          {headerRow}
        </div>
        {rows}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-800">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-800">
            <ChevronRight size={20} />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-4 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700"
          >
            Today
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 rounded text-sm ${view === 'month' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 rounded text-sm ${view === 'week' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Week
          </button>
          <button
            className="ml-2 flex items-center space-x-1 px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500"
          >
            <Plus size={16} />
            <span>New</span>
          </button>
        </div>
      </div>
      {view === 'month' && renderMonthView()}
    </div>
  );
};