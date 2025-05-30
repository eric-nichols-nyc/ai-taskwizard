import { Dashboard as RemoteDashboard } from 'dashboard/Dashboard';
import { DashboardLayout } from '../layouts/dashboard-layout';
export const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="h-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RemoteDashboard />
        </div>
      </div>
    </DashboardLayout>
  );
}; 