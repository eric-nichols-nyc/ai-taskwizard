//import { App as CalendarApp } from 'calendar/App';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { ErrorBoundary } from '@turbo-with-tailwind-v4/design-system';
import { ComingSoon } from '@turbo-with-tailwind-v4/design-system/components/coming-soon';

export const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="h-full">
        <ErrorBoundary>
            {/* <CalendarApp /> */}
            <ComingSoon />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};