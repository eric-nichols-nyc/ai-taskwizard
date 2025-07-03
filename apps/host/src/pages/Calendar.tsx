import { App as CalendarApp } from 'calendar/App';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { ErrorBoundary } from '@turbo-with-tailwind-v4/design-system';

export const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="h-full">
        <ErrorBoundary>
            <CalendarApp />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};