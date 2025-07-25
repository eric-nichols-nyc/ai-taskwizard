import { useState } from 'react';
import { KanbanBoard } from './kanban-board';
import { KanbanColumn } from './kanban-column';
import type { KanbanTask, KanbanColumn as KanbanColumnType } from '../../types/kanban';

// Example data
const initialColumns: KanbanColumnType[] = [
  { id: 'todo', title: 'To Do', description: 'Tasks to be done', position: 0 },
  { id: 'in-progress', title: 'In Progress', description: 'Tasks being worked on', position: 1 },
  { id: 'done', title: 'Done', description: 'Completed tasks', position: 2 },
];

const initialTasks: KanbanTask[] = [
  { id: '1', title: 'Learn DnD Kit', description: 'Study the documentation', status: 'todo', column_id: 'todo', position: 0 },
  { id: '2', title: 'Build Kanban Board', description: 'Create a drag and drop board', status: 'in-progress', column_id: 'in-progress', position: 0 },
  { id: '3', title: 'Add Features', description: 'Implement additional functionality', status: 'done', column_id: 'done', position: 0 },
];

export const KanbanExample = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);

  const handleTaskAdd = (newTask: Partial<KanbanTask>) => {
    const task: KanbanTask = {
      id: Date.now().toString(),
      title: newTask.title || 'New Task',
      description: newTask.description,
      status: newTask.status || 'todo',
      column_id: newTask.column_id || 'todo',
      position: newTask.position || 0,
    };
    setTasks(prev => [...prev, task]);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleColumnUpdate = (columnId: string, updates: Partial<KanbanColumnType>) => {
    setColumns(prev => prev.map(column =>
      column.id === columnId ? { ...column, ...updates } : column
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board Example</h1>
      <KanbanBoard
        columns={columns}
        onTaskAdd={handleTaskAdd}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onColumnUpdate={handleColumnUpdate}
        className="min-h-screen"
      >
        {columns.map(column => {
          const columnTasks = tasks.filter(task => task.column_id === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onTaskAdd={handleTaskAdd}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          );
        })}
      </KanbanBoard>
    </div>
  );
};