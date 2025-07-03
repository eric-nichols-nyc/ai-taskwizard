//import { App as KanbanApp } from 'kanban/App';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { ErrorBoundary } from '@turbo-with-tailwind-v4/design-system';
import { ComingSoon } from '@turbo-with-tailwind-v4/design-system/components/coming-soon';

export const Kanban = () => {
  return (
    <DashboardLayout>
      <div className="h-full">
        <ErrorBoundary>
          {/* <KanbanApp /> */}
          <ComingSoon />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};