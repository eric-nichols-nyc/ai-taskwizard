import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from '../calendar';
import * as useTaskServiceModule from '../../../hooks/use-task-service';
import { TaskProvider } from '../../../providers/task-provider';

// Mock the useTaskService hook
type Task = {
  dueDate: string;
  completed: boolean;
  task: string;
  taskId: string;
  priority: string;
  createdAt: string;
  sectionId: null;
  createTime: string;
  updateTime: string;
  userId: string;
};

vi.mock('../../../hooks/use-task-service');

const today = new Date();
const mockTasks: Task[] = [
  {
    dueDate: today.toISOString(),
    completed: false,
    task: 'Test Task',
    taskId: '1',
    priority: 'medium',
    createdAt: today.toISOString(),
    sectionId: null,
    createTime: today.toISOString(),
    updateTime: today.toISOString(),
    userId: 'user1',
  },
];

describe('Calendar', () => {
  it('renders today and shows the correct number of tasks for today', () => {
    vi.mocked(useTaskServiceModule.useTaskService).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      selectedDate: null,
      setSelectedDate: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      handleCalendarDayClick: vi.fn(),
      getTasksForDate: () => mockTasks,
      getTasksByPriority: vi.fn(),
      getCompletedTasks: vi.fn(),
      getPendingTasks: vi.fn(),
    });

    render(
      <TaskProvider>
        <Calendar />
      </TaskProvider>
    );
    // Find today's date cell
    const todayStr = today.getDate().toString();
    expect(screen.getByText(todayStr)).toBeInTheDocument();
    // The badge with the number of tasks should be present
    expect(screen.getByText('1')).toBeInTheDocument();
  });
}); 