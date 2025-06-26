import { SettingsPage } from "./Settings";
import { AuthProvider } from "@turbo-with-tailwind-v4/database";
export function App() {

  return (
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
  );
}