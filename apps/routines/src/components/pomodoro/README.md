# PomodoroSection Component

This folder contains the `PomodoroSection` React component, which implements a Pomodoro timer with play, pause, and reset functionality.

## Features
- **Timer:** Starts at 25:00 and counts down by seconds.
- **Controls:**
  - **Start:** Begins the countdown.
  - **Pause:** Pauses the countdown.
  - **Reset:** Resets the timer to 25:00.
- **UI:** Includes a timer display and control buttons.

## Usage
Import and use the component in your dashboard:

```tsx
import { PomodoroSection } from './pomodoro-section';

function App() {
  return <PomodoroSection />;
}
```

## Testing
- Tests are located in the `__tests__` subfolder.
- Tests cover rendering, timer display, and control button functionality.
- To run the tests:
  ```sh
  pnpm test
  ```
- To update or add tests, edit files in `__tests__/`.

## File Structure
- `pomodoro-section.tsx` — Main component implementation
- `__tests__/pomodoro-section.test.tsx` — Component tests 