import { Kanban } from './Kanban'
import { AuthProvider, QueryProvider } from '@turbo-with-tailwind-v4/database'

export function App() {

  return (
    <QueryProvider>
      <AuthProvider>
        <div className='w-full dark'>
          <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold'>Kanban</h1>
            <Kanban />
          </div>
        </div>
      </AuthProvider>
    </QueryProvider>
  )
}
