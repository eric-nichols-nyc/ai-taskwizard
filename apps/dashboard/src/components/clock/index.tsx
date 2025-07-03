import { useState, useEffect } from "react";
import { Card } from "@turbo-with-tailwind-v4/design-system/card";

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
      <p className="text-md text-gray-400 mb-1">{time.toLocaleDateString(undefined, { weekday: 'long' })}</p>
      <h1 className="text-2xl font-bold">{time.toLocaleTimeString()}</h1>
      <p className="text-lg text-gray-500 mt-2">{time.toLocaleDateString()}</p>
    </Card>
  );
}