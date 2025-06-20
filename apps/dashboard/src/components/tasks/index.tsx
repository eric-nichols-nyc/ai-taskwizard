import * as React from 'react';
import { TaskItem } from './task-item'; // This will be created next
import type { Task } from '@turbo-with-tailwind-v4/database';
import { useAddTask } from '../../hooks/use-tasks';
import { Button } from '@turbo-with-tailwind-v4/design-system/button';
import { Input } from '@turbo-with-tailwind-v4/design-system/input';

// The root container component
const TasksRoot = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full max-w-2xl mx-auto p-4">{children}</div>;
};
TasksRoot.displayName = 'Tasks';


// Component for adding a new task
const TasksInput = () => {
    const [title, setTitle] = React.useState('');
    const addTaskMutation = useAddTask();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTaskMutation.mutate({ title });
        setTitle(''); // Reset input after submission
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 p-2 border-b">
            <Input
                type="text"
                placeholder="Add a new task..."
                className="flex-1"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                disabled={addTaskMutation.isPending}
            />
            <Button type="submit" disabled={addTaskMutation.isPending || !title.trim()}>
                {addTaskMutation.isPending ? 'Adding...' : 'Add Task'}
            </Button>
        </form>
    )
}
TasksInput.displayName = 'TasksInput';


// The list container that will hold the task items
const TasksList = ({
  tasks,
  children,
}: {
  tasks: Task[];
  children: (task: Task) => React.ReactNode;
}) => {
  return (
    <ul className="space-y-2 mt-4">
      {tasks.map((task) => (
        <React.Fragment key={task.id}>{children(task)}</React.Fragment>
      ))}
    </ul>
  );
};
TasksList.displayName = 'TasksList';

// Compound Component Definition
export const Tasks = Object.assign(TasksRoot, {
  Input: TasksInput,
  List: TasksList,
  Item: TaskItem, // We'll attach the separate TaskItem component here
}); 