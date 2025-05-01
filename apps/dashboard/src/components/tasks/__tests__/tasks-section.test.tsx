import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { TasksSection } from '../tasks-section';

describe('TasksSection', () => {
  it('renders without crashing', () => {
    render(<TasksSection />);
    // Replace with something you expect to see in the component:
    // expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  });
}); 