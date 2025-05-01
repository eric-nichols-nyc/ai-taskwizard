import { Calendar } from 'calendar/Calendar';
import { Dashboard as RemoteDashboard } from 'dashboard/Dashboard';

export const Dashboard = () => {
  return (
    <div className="h-full space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E1E20] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Dashboard Overview</h2>
          <RemoteDashboard />
        </div>
        <div className="bg-[#1E1E20] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events</h2>
          <Calendar />
        </div>
      </div>
    </div>
  );
}; 