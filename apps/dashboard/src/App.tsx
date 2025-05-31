import { Dashboard } from './Dashboard'
import { useCurrentUser } from '@turbo-with-tailwind-v4/auth'

function App() {
  const { user, isLoaded } = useCurrentUser();
  console.log('dashboard app', user, isLoaded);

  return (
    <div className='w-full dark'>
      <Dashboard />
    </div>
  )
}

export default App
