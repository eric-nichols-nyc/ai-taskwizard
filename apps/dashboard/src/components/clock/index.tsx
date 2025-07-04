import { useState, useEffect } from "react";
import { Card } from "@turbo-with-tailwind-v4/design-system/card";
import { Clock as ClockIcon } from "lucide-react";
export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className=" flex flex-col items-center justify-center w-full h-full">
      <ClockIcon className="w-10 h-10" />
      <p className="text-md text-gray-400 mb-1">{time.toLocaleDateString(undefined, { weekday: 'long' })}</p>
      <h1 className="text-2xl font-bold">{time.toLocaleTimeString()}</h1>
    </Card>
  );
}