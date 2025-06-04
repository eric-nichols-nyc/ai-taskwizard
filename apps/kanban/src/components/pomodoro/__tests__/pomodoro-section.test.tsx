import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from "vitest";
import { PomodoroTimer } from '../pomodoro-timer';

describe('PomodoroSection', () => {
  const mockSetTimer = vi.fn();
  it('renders timer and controls', () => {
    render(<PomodoroTimer setTimer={mockSetTimer} />);
    expect(screen.getByText(/pomodoro/i)).toBeInTheDocument();
    expect(screen.getByTestId('timer-display')).toHaveTextContent('25:00');
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('starts, pauses, and resets the timer', () => {
    vi.useFakeTimers();
    render(<PomodoroTimer setTimer={mockSetTimer} />);
    const startButton = screen.getByRole('button', { name: /start/i });
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });
    const timerDisplay = screen.getByTestId('timer-display');

    // Start the timer
    fireEvent.click(startButton);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(timerDisplay.textContent).toBe('24:59');

    // Pause the timer
    fireEvent.click(pauseButton);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(timerDisplay.textContent).toBe('24:59');

    // Reset the timer
    fireEvent.click(resetButton);
    expect(timerDisplay.textContent).toBe('25:00');
    vi.useRealTimers();
  });
});
