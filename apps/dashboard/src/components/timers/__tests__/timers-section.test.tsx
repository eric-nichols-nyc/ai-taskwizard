import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { TimersSection } from '../timers-section';

describe('TimersSection', () => {
  it('renders without crashing', () => {
    render(<TimersSection />);
    // Replace with something you expect to see in the component:
    // expect(screen.getByText(/timer/i)).toBeInTheDocument();
  });
}); 