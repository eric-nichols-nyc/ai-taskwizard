# Kanban Components

A set of reusable Kanban board components built with DnD Kit for drag and drop functionality.

## Components

### KanbanBoard
The main container component that orchestrates drag and drop functionality.

### KanbanColumn
A column component that can contain tasks and supports dropping tasks into it.

### KanbanTask
A draggable task component that can be moved between columns.

## Usage

```tsx
import { KanbanBoard } from '@turbo-with-tailwind-v4/design-system';

const MyKanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);

  return (
    <KanbanBoard
      tasks={tasks}
      columns={columns}
      onTaskAdd={(task) => {
        // Handle adding new task
      }}
      onTaskUpdate={(taskId, updates) => {
        // Handle updating task
      }}
      onTaskDelete={(taskId) => {
        // Handle deleting task
      }}
    />
  );
};
```

## Features

- ✅ Drag and drop tasks between columns
- ✅ Reorder tasks within columns
- ✅ Reorder columns
- ✅ Scrollable task areas
- ✅ Custom task and column renderers
- ✅ Built-in task creation UI
- ✅ Responsive design

## Customization

You can customize the appearance and behavior using:

- `taskRenderer`: Custom component for rendering tasks
- `columnHeaderRenderer`: Custom component for rendering column headers
- `className`: Additional CSS classes
- Event handlers for all CRUD operations

## Dependencies

- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- lucide-react (for icons)
- Tailwind CSS (for styling)