import * as React from 'react';
import type { Task } from '@turbo-with-tailwind-v4/database';
import { useUpdateTask, useDeleteTask } from '@turbo-with-tailwind-v4/database/use-tasks';
import { Button } from '@turbo-with-tailwind-v4/design-system/button';
import { Checkbox } from '@turbo-with-tailwind-v4/design-system/checkbox';
import { Flag, Trash2, Pencil } from 'lucide-react'; // Using icons for actions
import { Input } from '@turbo-with-tailwind-v4/design-system/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@turbo-with-tailwind-v4/design-system/select';
import { Card } from '@turbo-with-tailwind-v4/design-system/card';

type Priority = 'Low' | 'Medium' | 'High';

type TaskItemProps = {
  task: Task;
  onDelete?: (taskId: string) => void;
};

export const TaskItem = ({ task, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(task.title);
  const [editedPriority, setEditedPriority] = React.useState<Priority>(task.priority ?? 'Medium');
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 'done' : 'todo';
    updateTaskMutation.mutate({ id: task.id, updates: { status: newStatus } });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    } else {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const handleSave = () => {
    const hasTitleChanged = editedTitle.trim() && editedTitle !== task.title;
    const hasPriorityChanged = editedPriority !== task.priority;

    if (hasTitleChanged || hasPriorityChanged) {
        updateTaskMutation.mutate({
            id: task.id,
            updates: {
                ...(hasTitleChanged && { title: editedTitle }),
                ...(hasPriorityChanged && { priority: editedPriority }),
            }
        });
    }
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Card className="flex items-center gap-4 bg-slate-700 rounded-2xl p-4 transition-colors">
        <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-lg flex-1 bg-transparent border-0 text-white focus:ring-0"
        />
        <div className="flex items-center gap-2">
            <Select value={editedPriority} onValueChange={(value) => setEditedPriority(value as Priority)}>
                <SelectTrigger className="w-[110px] bg-transparent border-0 text-orange-400 focus:ring-0">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500">
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={
        `flex items-center gap-4 rounded-2xl p-4 transition-colors relative cursor-pointer ` +
        `bg-slate-900/90 border-l-4 ` +
        `${task.priority === 'High' ? 'border-red-500' : task.priority === 'Medium' ? 'border-orange-400' : 'border-green-500'} ` +
        `shadow-2xl hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] hover:bg-slate-800`
      }
      data-pending={updateTaskMutation.isPending || deleteTaskMutation.isPending}
      style={{ minHeight: '64px' }}
    >
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={handleStatusChange}
        disabled={updateTaskMutation.isPending}
        className="w-6 h-6 rounded-full border-2 border-slate-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
      />

      <span className={`text-lg font-semibold flex-1 ${task.status === 'done' ? "text-slate-500 line-through" : "text-white"}`}>
        {task.title}
      </span>

      <div className="flex items-center gap-2 text-orange-400">
        <Flag className="w-4 h-4" />
        <span className="text-sm font-medium">{task.priority}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setIsEditing(true)}>
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