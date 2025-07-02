import { Kanban } from './Kanban'
import { AuthProvider, QueryProvider } from '@turbo-with-tailwind-v4/database'

export function App() {

  return (
    <QueryProvider>
      <AuthProvider>
        <div className='w-full dark'>
            <Kanban />
        </div>
      </AuthProvider>
    </QueryProvider>
  )
}
