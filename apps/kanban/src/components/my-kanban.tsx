import { KanbanBoard } from "./kanban-prototype/kanban-board";
import { useKanbanBoardState } from "../hooks/use-kanban-board";

export function MyKanban() {
  const { board, columns, tasks, isLoading, error, moveTask, addTask: addTaskFromHook } = useKanbanBoardState();
  return <KanbanBoard board={board} columns={columns} tasks={tasks} isLoading={isLoading} error={error} moveTask={moveTask} addTask={addTaskFromHook} />;
}