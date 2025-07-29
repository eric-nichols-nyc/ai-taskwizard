//import { Heading } from '@/components/ui/heading';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';

export default function KanbanViewPage() {
  return (
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
  );
}
