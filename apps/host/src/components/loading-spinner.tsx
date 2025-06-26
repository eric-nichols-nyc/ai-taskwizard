"use client"

import { useEffect, useState } from "react"
import { Card } from "@turbo-with-tailwind-v4/design-system/components/ui/card"
import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const timer = setInterval(() => {
        console.log("elapsedTime", elapsedTime)
      setElapsedTime((prev) => prev + 1)
    }, 1000)



    const dotsTimer = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "."
        return prev + "."
      })
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(dotsTimer)
    }
  }, [])


  return (
    <Card className="p-8 flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Researching company data{dots}</p>
      </div>
    </Card>
  )
}

