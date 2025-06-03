import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Calendar } from '../calendar';

describe('Calendar', () => {
  it('renders without crashing', () => {
    render(<Calendar />);
    // Replace with something you expect to see in the component:
    // expect(screen.getByText(/calendar/i)).toBeInTheDocument();
  });
}); 