import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Calendar } from '../calendar';
import { TasksSection } from '../../tasks/tasks-section';
// If you use a provider for shared state, import it:
import { TaskProvider } from '../../../providers/task-provider';

describe('Calendar and TasksSection integration', () => {
  it('adds a task and updates the task list (and calendar if connected)', async () => {
    render(
      <TaskProvider>
        <TasksSection />
        <Calendar />
      </TaskProvider>
    );

    // Simulate typing a new task
    const input = screen.getByPlaceholderText(/add a new task/i);
    fireEvent.change(input, { target: { value: 'Integration Test Task' } });

    // Simulate pressing Enter to add the task
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Check that the new task appears in the list
    expect(await screen.findByText('Integration Test Task')).toBeInTheDocument();

    // If your calendar is connected to the same state, check for the badge/count
    // (You may need to adjust this selector based on your calendar implementation)
    // expect(screen.getByText('1')).toBeInTheDocument();
  });
});
