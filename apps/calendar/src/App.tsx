import { CalendarApp } from './CalendarApp'
import { AuthProvider } from '@turbo-with-tailwind-v4/database'

export function App() {
  return (
    <AuthProvider>
      <CalendarApp />
    </AuthProvider>
  )
}

export { CalendarApp }
