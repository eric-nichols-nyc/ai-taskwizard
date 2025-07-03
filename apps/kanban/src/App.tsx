import { Kanban } from "./Kanban";
import { AuthProvider, QueryProvider } from "@turbo-with-tailwind-v4/database";
import { ComingSoon } from "@turbo-with-tailwind-v4/design-system/components/coming-soon";
import { ErrorBoundary } from "@turbo-with-tailwind-v4/design-system";

export function App() {
  return (
    <QueryProvider>
      <AuthProvider isHost={false}>
        <ErrorBoundary>
          {import.meta.env.VITE_NEW_KANBAN_ENABLED === "false" ? <ComingSoon /> : <Kanban />}
        </ErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  );
}
