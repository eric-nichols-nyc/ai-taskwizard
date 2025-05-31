import { CalendarApp } from 'calendar/CalendarApp';
import { DashboardLayout } from '../layouts/dashboard-layout';
export const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="h-full">
        <CalendarApp />
      </div>
    </DashboardLayout>
  );
}; 