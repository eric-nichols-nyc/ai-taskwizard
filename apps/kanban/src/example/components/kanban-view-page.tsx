//import { Heading } from '@/components/ui/heading';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';
import { Button } from '@turbo-with-tailwind-v4/design-system/components/ui/button';
import { useTaskStore } from '../utils/store';

export default function KanbanViewPage() {
  const resetStore = useTaskStore((state) => state.resetStore);

  return (
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <NewTaskDialog />
          <Button
            variant="outline"
            onClick={resetStore}
            className="text-sm"
          >
            Reset to Default
          </Button>
        </div>
        <KanbanBoard />
      </div>
  );
}
