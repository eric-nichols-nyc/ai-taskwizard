import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { TimersList } from '../timers-list';

describe('TimersSection', () => {
  it('renders without crashing', () => {
    render(<TimersList timers={[]} />);
    // Replace with something you expect to see in the component:
    // expect(screen.getByText(/timer/i)).toBeInTheDocument();
  });
}); 