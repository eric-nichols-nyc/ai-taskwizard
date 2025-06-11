import { Kanban } from './Kanban'

function App() {

  return (
    <div className='w-full dark'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Kanban</h1>
        <Kanban />
      </div>
    </div>
  )
}

export default App
