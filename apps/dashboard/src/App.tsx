import {
  AuthProvider,

} from "@turbo-with-tailwind-v4/database";
import { TestComponent } from "./components/test";
//import { Dashboard } from './Dashboard'


function DashboardApp() {
  return (
    <AuthProvider isHost={false}>
      <TestComponent />
    </AuthProvider>
  );
}

export default DashboardApp;
