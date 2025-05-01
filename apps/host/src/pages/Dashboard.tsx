import { Dashboard as RemoteDashboard } from 'dashboard/Dashboard';

export const Dashboard = () => {
  return (
    <div className="h-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RemoteDashboard />
      </div>
    </div>
  );
}; 