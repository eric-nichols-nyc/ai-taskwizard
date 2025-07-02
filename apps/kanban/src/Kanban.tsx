import { KanbanBoard } from "./components/kanban-prototype/kanban-board";
import { useAuth } from '@turbo-with-tailwind-v4/database';

export const Kanban = () => {
  const { user } = useAuth();
  console.log(user);
  return <KanbanBoard />;
};