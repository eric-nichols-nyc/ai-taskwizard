import { Dashboard as RemoteDashboard } from 'dashboard/Dashboard';
import { DashboardLayout } from '../layouts/dashboard-layout';
export const Dashboard = () => {
  return (
    <DashboardLayout>
          <RemoteDashboard />
    </DashboardLayout>
  );
}; 