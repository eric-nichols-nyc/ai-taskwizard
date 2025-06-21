import { CalendarApp } from './CalendarApp'
import { AuthProvider, QueryProvider } from '@turbo-with-tailwind-v4/database'

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <CalendarApp />
      </AuthProvider>
    </QueryProvider>
  )
}

export { CalendarApp }
