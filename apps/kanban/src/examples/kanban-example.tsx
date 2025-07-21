import { useState } from "react";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { KanbanDataTransformer, RawKanbanData } from "../lib/kanban-data-transformer";

// Example usage with your DB response
export function KanbanExample() {
  // Your DB response data
  const rawData: RawKanbanData = {
    "board": {
      "id": "29f10401-1eb7-4576-bfd1-0cde942b346c",
      "name": "Personal",
      "description": "Your personal board"
    },
    "columns": [
      {
        "id": "6a8d93bc-d226-4a73-9001-5cc270eba1d6",
        "board_id": "29f10401-1eb7-4576-bfd1-0cde942b346c",
        "name": "Todo",
        "position": 1
      },
      {
        "id": "c552c539-b09a-42a8-8b15-bfb4f99760af",
        "board_id": "29f10401-1eb7-4576-bfd1-0cde942b346c",
        "name": "In Progress",
        "position": 2
      },
      {
        "id": "830d0f6a-14f4-40a2-b606-684dbca205c6",
        "board_id": "29f10401-1eb7-4576-bfd1-0cde942b346c",
        "name": "Done",
        "position": 3
      }
    ],
    "tasks": [
      {
        "id": "9666caf3-a282-486b-ad10-93290fc6e4c0",
        "column_id": "6a8d93bc-d226-4a73-9001-5cc270eba1d6",
        "title": "Add unit tests for auth service",
        "description": null,
        "position": 4000,
        "status": "todo",
        "priority": "Low",
        "due_date": "2025-07-15"
      },
      {
        "id": "cbf5ed6f-b001-4c0e-be5e-5369407760e4",
        "column_id": "6a8d93bc-d226-4a73-9001-5cc270eba1d6",
        "title": "Setup error tracking",
        "description": "Detailed description for setup error tracking",
        "position": 5000,
        "status": "todo",
        "priority": "Low",
        "due_date": "2025-07-15"
      },
      {
        "id": "25019082-29b8-47a7-9635-2badfb349178",
        "column_id": "c552c539-b09a-42a8-8b15-bfb4f99760af",
        "title": "Add unit tests for auth service",
        "description": "Detailed description for add unit tests for auth service",
        "position": 4000,
        "status": "todo",
        "priority": "High",
        "due_date": "2025-07-15"
      },
      {
        "id": "2bd91a13-3067-4572-b6b3-70177783f74a",
        "column_id": "c552c539-b09a-42a8-8b15-bfb4f99760af",
        "title": "Create performance benchmarks",
        "description": null,
        "position": 5000,
        "status": "todo",
        "priority": "Low",
        "due_date": "2025-07-15"
      },
      {
        "id": "7f2a8789-34e1-4d9c-b844-1c680f1ec18a",
        "column_id": "830d0f6a-14f4-40a2-b606-684dbca205c6",
        "title": "sleep",
        "description": null,
        "position": 1000,
        "status": "done",
        "priority": "Medium",
        "due_date": "2025-07-03"
      },
      {
        "id": "706e847e-b5bd-44a1-8130-5b1336e7fa30",
        "column_id": "830d0f6a-14f4-40a2-b606-684dbca205c6",
        "title": "hello",
        "description": null,
        "position": 2000,
        "status": "done",
        "priority": "Medium",
        "due_date": "2025-07-09"
      }
    ]
  };

  // State to track the current board data
  const [currentData, setCurrentData] = useState(rawData);

  // Transform the data once
  const transformedData = KanbanDataTransformer.transform(currentData);

  // Handle task movement with state updates
  const handleTaskMove = (taskId: string, newColumnId: string, newPosition: number) => {
    console.log('Moving task', taskId, 'to column', newColumnId, 'at position', newPosition);

    // Update the local state to reflect the change immediately
    setCurrentData(prevData => ({
      ...prevData,
      tasks: prevData.tasks.map(task =>
        task.id === taskId
          ? { ...task, column_id: newColumnId, position: newPosition }
          : task
      )
    }));

    // Here you would typically make an API call to update the task
    // For now, we'll just log the action
    console.log('Task moved successfully:', { taskId, newColumnId, newPosition });
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Kanban Board Example</h2>
        <p className="text-blue-700 text-sm">
          Try dragging tasks between columns! The state will update immediately for a smooth experience.
        </p>
      </div>

      <KanbanBoard
        data={transformedData}
        onTaskMove={handleTaskMove}
      />
    </div>
  );
}