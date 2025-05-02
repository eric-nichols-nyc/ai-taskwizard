import { useRef, useState } from "react";
export function useTimer() {
    const initialTime = 25 * 60
    const [time, setTime] = useState(initialTime)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)


  const startTimer = () => {
    console.log("startTimer");
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev > 0) return prev - 1
          clearInterval(intervalRef.current as NodeJS.Timeout)
          setIsRunning(false)
          return 0
        })
      }, 1000)
    }
  }

  const pauseTimer = () => {
    console.log("pauseTimer");
    setIsRunning(false)
    // stop the timer
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const resetTimer = () => {
    console.log("resetTimer");
    setTime(initialTime)
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return { startTimer, pauseTimer, resetTimer, time, isRunning, initialTime };
}
