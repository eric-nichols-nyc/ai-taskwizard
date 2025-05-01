import { render, screen } from '@testing-library/react';
import { describe, it, expect } from "vitest";
import { PomodoroSection } from '../pomodoro-section';

describe('PomodoroSection', () => {
  it('renders without crashing', () => {
    render(<PomodoroSection />);
    // Replace with something you expect to see in the component:
    expect(screen.getByText(/pomodoro/i)).toBeInTheDocument();
  });
});
