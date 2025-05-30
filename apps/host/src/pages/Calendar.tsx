import { Calendar as RemoteCalendar } from 'calendar/Calendar';
import { DashboardLayout } from '../layouts/dashboard-layout';
export const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="h-full">
        <RemoteCalendar />
      </div>
    </DashboardLayout>
  );
}; 