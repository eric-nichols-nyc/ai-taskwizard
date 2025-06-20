import { DashboardLayout } from "../layouts/dashboard-layout";
import { App as RemoteSettings } from 'settings/App';
export const Settings = () => {
  return (
    <DashboardLayout>
      <RemoteSettings />
    </DashboardLayout>
  );
}; 