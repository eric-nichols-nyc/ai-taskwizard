import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { KanbanBoard } from './kanban-board';

// Mock Zustand store reset utility
const resetStore = () => {
  // Optionally, you can reset the Zustand store here if needed
};

describe('KanbanBoard', () => {
  beforeEach(() => {
    resetStore();
  });

  it('renders columns and tasks', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Design homepage')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('can add a new task', async () => {
    render(<KanbanBoard />);
    const addCardButtons = screen.getAllByRole('button', { name: /add a card/i });
    fireEvent.click(addCardButtons[0]);
    // Pause for 500ms (for debugging)
    await new Promise(res => setTimeout(res, 500));
    // Wait for the input to appear
    const input = await screen.findByPlaceholderText('Task title');
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add Task'));
    // Pause for 500ms (for debugging)
    await new Promise(res => setTimeout(res, 500));
    // Wait for the new task to appear
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });
}); 