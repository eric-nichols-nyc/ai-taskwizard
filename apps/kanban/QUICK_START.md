# Kanban Board Quick Start Guide

Get up and running with the kanban board implementation in minutes!

## 🚀 Quick Setup

### **1. Basic Implementation**

```typescript
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { KanbanDataTransformer } from './lib/kanban-data-transformer';

// Your database response
const rawData = {
  board: {
    id: "29f10401-1eb7-4576-bfd1-0cde942b346c",
    name: "Personal",
    description: "Your personal board"
  },
  columns: [
    {
      id: "6a8d93bc-d226-4a73-9001-5cc270eba1d6",
      board_id: "29f10401-1eb7-4576-bfd1-0cde942b346c",
      name: "Todo",
      position: 1
    },
    // ... more columns
  ],
  tasks: [
    {
      id: "9666caf3-a282-486b-ad10-93290fc6e4c0",
      column_id: "6a8d93bc-d226-4a73-9001-5cc270eba1d6",
      title: "Add unit tests for auth service",
      description: null,
      position: 4000,
      status: "todo",
      priority: "Low",
      due_date: "2025-07-15"
    },
    // ... more tasks
  ]
};

// Transform data once for efficiency
const transformedData = KanbanDataTransformer.transform(rawData);

// Handle task movement
const handleTaskMove = (taskId: string, newColumnId: string, newPosition: number) => {
  console.log('Moving task', taskId, 'to column', newColumnId, 'at position', newPosition);
  // Make API call to update task
};

// Render the board
return (
  <KanbanBoard
    data={transformedData}
    onTaskMove={handleTaskMove}
  />
);
```

### **2. Complete Example**

See `examples/kanban-example.tsx` for a full working example with your exact data structure.

## 📋 Prerequisites

### **Required Dependencies**

```json
{
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/sortable": "^7.0.0",
  "@dnd-kit/utilities": "^3.2.0",
  "react": "^18.0.0",
  "typescript": "^4.9.0"
}
```

### **Optional Dependencies**

```json
{
  "tailwindcss": "^3.0.0",
  "@types/react": "^18.0.0"
}
```

## 🎯 Common Use Cases

### **1. Simple Board Display**

```typescript
// Just display the board without drag-and-drop
const SimpleBoard = ({ data }) => {
  const transformedData = KanbanDataTransformer.transform(data);

  return (
    <div className="kanban-board">
      {transformedData.columns?.map(column => (
        <div key={column.id} className="column">
          <h3>{column.name}</h3>
          {KanbanDataTransformer.getSortedTasksForColumn(transformedData, column.id).map(task => (
            <div key={task.id} className="task">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### **2. With Custom Styling**

```typescript
// Custom styled board
const CustomKanbanBoard = ({ data, onTaskMove }) => {
  const transformedData = KanbanDataTransformer.transform(data);

  return (
    <div className="custom-kanban-container">
      <KanbanBoard
        data={transformedData}
        onTaskMove={onTaskMove}
      />
    </div>
  );
};

// Add custom CSS
const styles = `
.custom-kanban-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 1rem;
}

.custom-kanban-container .column {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
`;
```

### **3. With Real-time Updates**

```typescript
// Board with real-time updates
const LiveKanbanBoard = ({ data, onTaskMove }) => {
  const [boardData, setBoardData] = useState(data);

  // Update board data when new data arrives
  useEffect(() => {
    setBoardData(data);
  }, [data]);

  const transformedData = KanbanDataTransformer.transform(boardData);

  return (
    <KanbanBoard
      data={transformedData}
      onTaskMove={onTaskMove}
    />
  );
};
```

### **4. With Loading States**

```typescript
// Board with loading states
const KanbanBoardWithLoading = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading kanban board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading board</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const transformedData = KanbanDataTransformer.transform(data);

  return (
    <KanbanBoard
      data={transformedData}
      onTaskMove={handleTaskMove}
    />
  );
};
```

## 🔧 Configuration Options

### **Custom Drag & Drop Settings**

```typescript
// Customize drag activation
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // Require 5px movement before drag starts
      delay: 200   // 200ms delay before drag starts
    },
  })
);
```

### **Custom Position Calculation**

```typescript
// Custom position calculation strategy
const calculateCustomPosition = (targetColumnId: string, tasks: Task[]) => {
  const targetColumnTasks = tasks.filter(task => task.column_id === targetColumnId);

  if (targetColumnTasks.length === 0) {
    return 1000; // First task in column
  }

  // Place at the end of the column
  const maxPosition = Math.max(...targetColumnTasks.map(t => t.position));
  return maxPosition + 1000;
};
```

### **Custom Task Rendering**

```typescript
// Custom task card component
const CustomTaskCard = ({ task, ...props }) => (
  <div className="custom-task-card" {...props}>
    <div className="task-header">
      <h4>{task.title}</h4>
      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
        {task.priority}
      </span>
    </div>
    {task.description && (
      <p className="task-description">{task.description}</p>
    )}
    {task.due_date && (
      <div className="task-due-date">
        Due: {new Date(task.due_date).toLocaleDateString()}
      </div>
    )}
  </div>
);
```

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Tasks Not Dragging**

**Problem**: Tasks don't respond to drag events.

**Solution**: Check that task IDs are unique and properly set:

```typescript
// Ensure unique IDs
const tasks = [
  { id: "task-1", title: "Task 1", ... },
  { id: "task-2", title: "Task 2", ... },
  // ...
];
```

#### **2. Performance Issues**

**Problem**: Board is slow with many tasks.

**Solution**: Use the data transformer efficiently:

```typescript
// ✅ Good: Transform once
const transformedData = KanbanDataTransformer.transform(rawData);

// ❌ Bad: Transform on every render
const columnTasks = rawData.tasks.filter(task => task.column_id === columnId);
```

#### **3. Type Errors**

**Problem**: TypeScript errors with data types.

**Solution**: Ensure your data matches the expected interface:

```typescript
// Check your data structure
interface RawKanbanData {
  board: { id: string; name: string; description: string };
  columns: Array<{ id: string; board_id: string; name: string; position: number }>;
  tasks: Array<{ id: string; column_id: string; title: string; /* ... */ }>;
}
```

#### **4. Styling Issues**

**Problem**: Components don't look right.

**Solution**: Ensure Tailwind CSS is properly configured:

```typescript
// Add required Tailwind classes
className="flex gap-6 overflow-x-auto pb-6 justify-center items-start w-full"
```

## 📚 Next Steps

### **1. Add More Features**

- **Task Details Modal**: Click tasks to edit details
- **Column Management**: Add, edit, delete columns
- **Advanced Filtering**: Filter by priority, due date, assignee
- **Search**: Search tasks by title or description

### **2. Integrate with Backend**

- **API Integration**: Connect to your backend API
- **Real-time Updates**: Add WebSocket support
- **Optimistic Updates**: Update UI immediately, sync with server
- **Error Handling**: Handle API errors gracefully

### **3. Enhance UX**

- **Keyboard Shortcuts**: Add keyboard navigation
- **Mobile Support**: Optimize for touch devices
- **Accessibility**: Add ARIA labels and screen reader support
- **Animations**: Add smooth transitions and animations

### **4. Performance Optimization**

- **Virtualization**: Handle large datasets efficiently
- **Memoization**: Optimize component re-renders
- **Lazy Loading**: Load data on demand
- **Caching**: Cache frequently accessed data

## 🆘 Getting Help

### **Debug Mode**

Enable detailed logging to troubleshoot issues:

```typescript
// Add debug logging
console.log('Raw data:', rawData);
console.log('Transformed data:', transformedData);
console.log('Column tasks:', KanbanDataTransformer.getSortedTasksForColumn(transformedData, columnId));
```

### **Check Examples**

- **Basic Example**: `examples/kanban-example.tsx`
- **Full Implementation**: `src/Kanban.tsx`
- **Data Transformer**: `lib/kanban-data-transformer.ts`

### **Common Patterns**

- **Data Flow**: Raw data → Transform → Render
- **Event Handling**: Drag start → Move → End → Update
- **State Management**: Local state → Callback → Parent update

## 🎉 Success!

You now have a fully functional kanban board with:

- ✅ Drag and drop functionality
- ✅ Efficient data processing
- ✅ Type-safe implementation
- ✅ Modular component architecture
- ✅ Performance optimizations

Happy coding! 🚀