# Kanban Feature Documentation

This folder implements a **Kanban board** for task management, supporting drag-and-drop (DnD) for both columns (sections) and tasks. It is designed for integration into a Next.js dashboard and leverages Zustand for state management and @dnd-kit for DnD interactions.

## Main Features
- **Drag-and-drop columns and tasks**: Reorder columns and move tasks between columns using mouse or touch.
- **Persistent state**: Uses Zustand with local storage persistence for tasks and columns.
- **Add, rename, and delete columns (sections)**
- **Add and remove tasks**
- **Accessible DnD announcements** for screen readers

## Kanban Board Structure (Diagram)

```
+-------------------+   +-------------------+   +-------------------+
|      TODO         |   |   IN PROGRESS     |   |      DONE         |
|-------------------|   |-------------------|   |-------------------|
| [Task 1]          |   | [Task 3]          |   | [Task 5]          |
| [Task 2]          |   | [Task 4]          |   | [Task 6]          |
| [Add New Todo]    |   |                   |   |                   |
+-------------------+   +-------------------+   +-------------------+
        |                      |                        |
        |<------ Drag & Drop Tasks/Columns ------------>|
```

- **Columns** represent sections (e.g., Todo, In Progress, Done).
- **Tasks** are cards within columns and can be moved between columns or reordered within a column.
- **Add New Todo** and **Add New Section** buttons allow for dynamic board updates.

## File Overview

### Components
- **kanban-view-page.tsx**: Entry point for the Kanban view. Renders the board and the UI for adding new tasks.
- **kanban-board.tsx**: Core logic for rendering columns and tasks, handling DnD events, and managing board state.
- **board-column.tsx**: Renders a single column (section) with its tasks. Supports DnD for columns and contains the logic for rendering and reordering tasks within the column.
- **column-action.tsx**: Dropdown menu for renaming or deleting a column. Includes a confirmation dialog for deletion.
- **new-section-dialog.tsx**: Dialog/modal for adding a new column (section) to the board.
- **new-task-dialog.tsx**: Dialog/modal for adding a new task to the board. Tasks are added to the default column ("Todo").
- **task-card.tsx**: Renders an individual task card, supporting DnD for reordering and moving between columns.

### Utils
- **store.ts**: Zustand store for managing tasks and columns. Exposes actions for adding, updating, removing, and reordering tasks and columns. State is persisted in local storage.
- **index.ts**: Utility function for checking if a DnD entry contains draggable data (column or task).

## State Structure
- **tasks**: Array of task objects `{ id, title, description, status }`.
- **columns**: Array of column objects `{ id, title }`.
- **draggedTask**: ID of the currently dragged task (if any).

## Usage
- **Add a new section**: Click the "+ Add New Section" button to open a dialog and enter a section name.
- **Rename/delete a section**: Use the actions menu (three dots) on a column header.
- **Add a new task**: Click the "+ Add New Todo" button to open a dialog and enter task details.
- **Move tasks/columns**: Drag and drop tasks between columns or reorder columns by dragging their headers.

## Accessibility
- DnD events provide announcements for screen readers, improving accessibility for users with assistive technologies.

## Integration
The Kanban view is integrated into the dashboard at `src/app/dashboard/kanban/page.tsx`:
```tsx
import KanbanViewPage from '@/features/kanban/components/kanban-view-page';

export default function page() {
  return <KanbanViewPage />;
}
```

## Extending Functionality
- Add more columns by default by editing `defaultCols` in `kanban-board.tsx` and `store.ts`.
- Extend the `Task` type to include more fields (e.g., due date, assignee).
- Add more actions to tasks or columns as needed.

---

**This Kanban feature is modular and can be further customized to fit your application's needs.**
