import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../ui/card';
import type { KanbanTaskProps } from '../../types/kanban';

export const KanbanTask = ({
  task,
  onUpdate,
  onDelete,
  className = '',
  children
}: KanbanTaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 mb-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      } ${className}`}
      {...attributes}
      {...listeners}
    >
      {children || (
        <div>
          <h4 className="font-medium text-sm mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-600">{task.description}</p>
          )}
        </div>
      )}
    </Card>
  );
};