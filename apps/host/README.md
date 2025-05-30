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

## Host Application Overview

The Host application serves as the main entry point for TaskMaster AI, providing a unified interface for productivity, collaboration, and AI-powered assistance. It is built with React, TypeScript, Vite, TanStack Router, Clerk for authentication, and Tailwind CSS for styling. The app is designed to be modular, with several core pages and remote components.

### Main Features & Pages
- **Dashboard**: The landing page, aggregating key widgets and productivity insights. (Uses a remote Dashboard component)
- **Notes**: A dedicated space for note-taking and organization.
- **Calendar**: View and manage your schedule. (Uses a remote Calendar component)
- **Friends**: Manage your social connections and collaborate.
- **Community**: Engage with the broader TaskMaster AI community.
- **Focus Mode**: Tools and environment for distraction-free productivity.
- **AI Assistant**: Access AI-powered features and assistance.
- **Settings**: Configure your preferences and account settings.
- **Login**: Secure authentication via Clerk.

### Navigation & Layout
- The sidebar provides quick access to all main pages, as well as a premium upgrade button and user profile summary.
- Most pages use a consistent dashboard layout, with the sidebar on the left and main content on the right.

### Authentication
- User authentication is handled by Clerk. Unauthenticated users are redirected to the login page.
- The `ClerkProviderWrapper` ensures authentication context is available throughout the app.

### Architecture
- **React + Vite**: Fast development and HMR.
- **TanStack Router**: Type-safe, declarative routing.
- **Clerk**: Authentication and user management.
- **Tailwind CSS**: Utility-first styling.
- **Remote Components**: Some features (e.g., Dashboard, Calendar) are loaded as remote components for modularity and scalability.

---
