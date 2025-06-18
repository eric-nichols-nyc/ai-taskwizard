import { DashboardLayout } from '../layouts/dashboard-layout';
import RemoteDashboard from 'dashboard/App';

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <RemoteDashboard />
    </DashboardLayout>
  );
}; 