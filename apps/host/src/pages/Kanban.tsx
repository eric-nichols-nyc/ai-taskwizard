//import { App as KanbanApp } from 'kanban/App';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { ErrorBoundary } from '@turbo-with-tailwind-v4/design-system';
import { App as KanbanApp } from 'kanban/App';


export const Kanban = () => {
  return (
    <DashboardLayout>
      <div className="h-full">
        <ErrorBoundary>
          <KanbanApp />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};