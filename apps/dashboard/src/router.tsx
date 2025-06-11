import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { Dashboard } from './Dashboard'
import { SignIn } from '@turbo-with-tailwind-v4/supabase'

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
  component: SignIn,
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([dashboardRoute, signInRoute]),
})

// Declare types for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}