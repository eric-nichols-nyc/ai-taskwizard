import { useState } from 'react'
import { Button } from '@turbo-with-tailwind-v4/design-system/button'
import { Dashboard } from 'dashboard/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full p-8 gap-8'>
      <div className='border border-red-500 p-4 rounded-lg w-full'>
        <Dashboard />
      </div>
      <Button variant='contained' color='primary' onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </div>
  )
}

export default App
