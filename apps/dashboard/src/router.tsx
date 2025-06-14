import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  Route,
} from '@tanstack/react-router'
import { Dashboard } from './Dashboard'
import { LoginPage } from './pages/signin'
import AuthCallback from './pages/auth/callback'

const rootRoute = createRootRoute({
  component: Outlet,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin', // or '/login' if you prefer
  component: LoginPage,
})

const authCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallback,
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([dashboardRoute, signInRoute, authCallbackRoute]),
})

// Declare types for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}