import { App as CalendarApp } from 'calendar/App';
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