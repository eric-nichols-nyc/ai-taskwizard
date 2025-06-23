import { DashboardLayout } from '../layouts/dashboard-layout';
import RemoteDashboard from 'dashboard/App';
import { ErrorBoundary } from '@turbo-with-tailwind-v4/design-system';

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <RemoteDashboard />
      </ErrorBoundary>
    </DashboardLayout>
  );
}; 