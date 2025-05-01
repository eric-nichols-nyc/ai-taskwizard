import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { WeatherSection } from '../weather-section';

describe('WeatherSection', () => {
  it('renders without crashing', () => {
    render(<WeatherSection />);
    // Replace with something you expect to see in the component:
    // expect(screen.getByText(/weather/i)).toBeInTheDocument();
  });
}); 