import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { Root } from './Root';
//import { Dashboard } from './pages/Dashboard';
//import { Notes } from './pages/Notes';
//import { Calendar } from './pages/Calendar';
import { Friends } from './pages/Friends';
// import { Community } from './pages/Community';
// import { FocusMode } from './pages/FocusMode';
// import { AIAssistant } from './pages/AIAssistant';
// import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import AuthCallback from './pages/auth/callback';

// Define routes
const rootRoute = createRootRoute({
  component: Root,
});

// create a route for the auth callback
const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallback,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

// const dashboardRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/dashboard',
//   component: Dashboard,
// });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// const notesRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/notes',
//   component: Notes,
// });

// const calendarRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/calendar',
//   component: Calendar,
// });

const friendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/friends',
  component: Friends,
});

// const communityRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/community',
//   component: Community,
// });

// const focusModeRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/focus',
//   component: FocusMode,
// });

// const aiAssistantRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/ai-assistant',
//   component: AIAssistant,
// });

// const settingsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/settings',
//   component: Settings,
// });

// Create and export the router
export const routeTree = rootRoute.addChildren([
  indexRoute,
  //dashboardRoute,
 // notesRoute,
  //calendarRoute,
  friendsRoute,
  //communityRoute,
  //focusModeRoute,
  ///aiAssistantRoute,
  //settingsRoute,
  loginRoute,
  authCallbackRoute,
]);

export const router = createRouter({ routeTree });

// Declare types for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 