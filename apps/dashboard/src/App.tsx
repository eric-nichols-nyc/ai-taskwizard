import { AuthProvider } from "@turbo-with-tailwind-v4/database";
import { Dashboard } from "./components/dashboard/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@turbo-with-tailwind-v4/design-system";
import { User } from "@turbo-with-tailwind-v4/database";
import { Toaster } from "react-hot-toast";
// Create a client
const queryClient = new QueryClient();

function DashboardApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider isHost={false}>
        <ErrorBoundary>
          {import.meta.env.MODE === "development" && <User />}
          <Dashboard />
          <Toaster position="bottom-left" reverseOrder={false} />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default DashboardApp;
