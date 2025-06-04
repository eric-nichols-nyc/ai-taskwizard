# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Testing Components with Vitest

This project uses [Vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for component testing. Jest DOM matchers are enabled via [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/).

### Setup
- All jest-dom matchers (like `toBeInTheDocument`) are available in tests because of the setup file: `src/setupTests.ts`.
- The setup file is automatically loaded by Vitest (see `vitest.config.ts`).

### How to Run Tests

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Run all tests:
   ```sh
   pnpm test
   ```
   or
   ```sh
   pnpm vitest
   ```
3. (Optional) Run in interactive UI mode:
   ```sh
   pnpm vitest --ui
   ```

### Writing Tests
- Place test files in a `__tests__` folder inside each component directory, or use the `.test.tsx` extension next to the component file.
- Example test file: `src/components/pomodoro/__tests__/pomodoro-section.test.tsx`
- Example setup file: `src/setupTests.ts`

### Example Test
```tsx
import { render, screen } from '@testing-library/react';
import { PomodoroSection } from '../pomodoro-section';

describe('PomodoroSection', () => {
  it('renders without crashing', () => {
    render(<PomodoroSection />);
    expect(screen.getByText(/pomodoro/i)).toBeInTheDocument();
  });
});
```
