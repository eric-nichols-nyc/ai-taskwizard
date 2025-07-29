  import { Button } from '@turbo-with-tailwind-v4/design-system/components/ui/button';
  import { Card, CardContent } from '@turbo-with-tailwind-v4/design-system/components/ui/card';
  import { Task } from '../utils/store';
  import { useSortable } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import { cva } from 'class-variance-authority';
  import { IconGripVertical } from '@tabler/icons-react';
  import { Badge } from '@turbo-with-tailwind-v4/design-system/components/ui/badge';

  // export interface Task {
  //   id: UniqueIdentifier;
  //   columnId: ColumnId;
  //   content: string;
  // }

  interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
  }

  export type TaskType = 'Task';

  export interface TaskDragData {
    type: TaskType;
    task: Task;
  }

  export function TaskCard({ task, isOverlay }: TaskCardProps) {
    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: task.id,
      data: {
        type: 'Task',
        task
      } satisfies TaskDragData,
      attributes: {
        roleDescription: 'Task'
      }
    });

    const style = {
      transition,
      transform: CSS.Translate.toString(transform)
    };

    const variants = cva('mb-2', {
      variants: {
        dragging: {
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary'
        }
      }
    });

    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
        })}
      >
        <CardContent className='flex px-3 pt-3 pb-6 text-left whitespace-pre-wrap'>
        <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className='text-secondary-foreground/50 -ml-2 h-auto cursor-grab p-1'
          >
            <IconGripVertical size={16} />
            <span className='sr-only'>Move task</span>
          </Button>

          {task.title}
          <div className='ml-auto flex items-center gap-2'>
            <Badge variant={'outline'} className='font-semibold'>
              {task.position + 1}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }
