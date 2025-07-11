import { Kanban } from "./Kanban";
import { KanbanUserTester } from "./components/dynamic-tester/kanban-user-tester";
import { AuthProvider, QueryProvider } from "@turbo-with-tailwind-v4/database";
import { ComingSoon } from "@turbo-with-tailwind-v4/design-system/components/coming-soon";
import { ErrorBoundary } from "@turbo-with-tailwind-v4/design-system";
import {Toaster} from "react-hot-toast"

export function App() {
  return (
    <QueryProvider>
      <AuthProvider isHost={false}>
        <ErrorBoundary>
          {import.meta.env.VITE_NEW_KANBAN_ENABLED === "false" ? <ComingSoon /> : <KanbanUserTester />}
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  );
}
