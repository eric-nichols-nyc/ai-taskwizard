import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from '../calendar';
import * as useTaskServiceModule from '../../../hooks/use-task-service';
import { TaskProvider } from '../../../providers/task-provider';

// Mock the useTaskService hook
type Task = {
  id: string; // UUID
  column_id: string; // UUID
  title: string;
  description?: string | null;
  position: number;
  status: string;
  priority?: 'Low' | 'Medium' | 'High' | null;
  due_date?: string | null; // ISO date string
  assignee_id?: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

vi.mock('../../../hooks/use-task-service');

const today = new Date();
const mockTasks: Task[] = [
  {
    due_date: today.toISOString(),
    status: 'pending',
    title: 'Test Task',
    id: '1',
    priority: 'Medium',
    created_at: today.toISOString(),
    updated_at: today.toISOString(),
    assignee_id: 'user1',
    column_id: '1',
    position: 1,
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