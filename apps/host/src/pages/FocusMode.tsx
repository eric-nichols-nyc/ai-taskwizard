import { DashboardLayout } from "../layouts/dashboard-layout"
import { FocusApp } from 'focus/FocusApp';
export const FocusMode = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Focus Mode</h1>
      <FocusApp />
    </DashboardLayout>
  );
}; 