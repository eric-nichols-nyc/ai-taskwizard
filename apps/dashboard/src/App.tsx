import {
  AuthProvider,

} from "@turbo-with-tailwind-v4/database";
import { Dashboard } from "./components/dashboard/dashboard";


function DashboardApp() {
  return (
    <AuthProvider isHost={false}>
      <Dashboard />
    </AuthProvider>
  );
}

export default DashboardApp;
