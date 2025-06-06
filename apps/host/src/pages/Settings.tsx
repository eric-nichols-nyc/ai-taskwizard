import { DashboardLayout } from "../layouts/dashboard-layout";
import { Settings as RemoteSettings } from 'settings/Settings';
export const Settings = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <RemoteSettings />
    </DashboardLayout>
  );
}; 