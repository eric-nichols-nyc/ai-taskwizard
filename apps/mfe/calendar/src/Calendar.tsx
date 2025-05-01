import { Button } from "@turbo-with-tailwind-v4/design-system/button"

export const Calendar = () => {
  return <div className='border border-red-500 flex flex-col items-center justify-center'>
    <h1>Calendar</h1>
    <Button variant='contained' color='primary'>
      Click me
    </Button>
  </div>
}