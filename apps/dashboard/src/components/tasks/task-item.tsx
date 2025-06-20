import * as React from 'react';
import type { Task } from '@turbo-with-tailwind-v4/database';
import { useUpdateTask, useDeleteTask } from '../../hooks/use-tasks';
import { Button } from '@turbo-with-tailwind-v4/design-system/button';
import { Checkbox } from '@turbo-with-tailwind-v4/design-system/checkbox';
import { Flag, Trash2, Pencil } from 'lucide-react'; // Using icons for actions

type TaskItemProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskItemProps) => {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 'done' : 'todo';
    updateTaskMutation.mutate({ id: task.id, updates: { status: newStatus } });
  };

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id);
  };

  return (
    <div
      className="flex items-center gap-4 bg-slate-800/50 rounded-2xl p-4 hover:bg-slate-800/70 transition-colors"
      data-pending={updateTaskMutation.isPending || deleteTaskMutation.isPending}
    >
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={handleStatusChange}
        disabled={updateTaskMutation.isPending}
        className="w-6 h-6 rounded-full border-2 border-slate-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
      />

      <span className={`text-lg flex-1 ${task.status === 'done' ? "text-slate-500 line-through" : "text-white"}`}>
        {task.title}
      </span>

      <div className="flex items-center gap-2 text-orange-400">
        <Flag className="w-4 h-4" />
        <span className="text-sm font-medium">{task.priority}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleteTaskMutation.isPending} className="text-slate-400 hover:text-red-500">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

TaskItem.displayName = 'TaskItem'; 