import {KanbanBoard} from "./components/kanban-prototype/kanban-board";
import { KanbanUserTester } from "./components/dynamic-tester/kanban-user-tester";
import { AuthProvider, QueryProvider } from "@turbo-with-tailwind-v4/database";
import { ComingSoon } from "@turbo-with-tailwind-v4/design-system/components/coming-soon";
import { ErrorBoundary } from "@turbo-with-tailwind-v4/design-system";
import {Toaster} from "react-hot-toast"
import { User } from "@turbo-with-tailwind-v4/database";

const USE_KANBAN_TESTER = true; // Toggle this for dev

export function App() {
  return (
    <QueryProvider>
      <AuthProvider isHost={false}>
        <ErrorBoundary>
          <User />
          {import.meta.env.VITE_NEW_KANBAN_ENABLED === "false" ? <ComingSoon /> : (USE_KANBAN_TESTER ? <KanbanUserTester /> : <KanbanBoard />)}
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  );
}
