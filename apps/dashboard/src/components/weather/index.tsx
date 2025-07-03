import { useState, useEffect } from "react";
import { Card, CardContent } from "@turbo-with-tailwind-v4/design-system/card";
import { Sun } from "lucide-react";

export function Weather() {
  const [weather, setWeather] = useState('72°F');

  useEffect(() => {
    setWeather('72°F');
  }, []);

  return (
    <Card className=" text-white">
      <CardContent className="p-6 text-center">
        <Sun className="w-8 h-8 mx-auto mb-2" />
        <div className="text-2xl font-bold">{weather}</div>
        <div className="text-sm opacity-80">Sunny & Beautiful</div>
      </CardContent>
    </Card>
  );
}
