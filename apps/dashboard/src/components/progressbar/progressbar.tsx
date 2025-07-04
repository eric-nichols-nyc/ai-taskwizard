import { useState, useEffect } from "react";
import {
  Card,

  CardContent,
} from "@turbo-with-tailwind-v4/design-system/card";
import { AnimatedProgressBar } from "@turbo-with-tailwind-v4/design-system/animated-progress-bar";
import { Slider } from "@turbo-with-tailwind-v4/design-system/slider";

export const ProgressBar = () => {
  const [manualValue, setManualValue] = useState([0]);

  useEffect(() => {
    console.log(manualValue);
  }, [manualValue]);

  return (
    <Card className="bg-gray-900 border-gray-800 w-full">
      <CardContent className="space-y-6">
        <AnimatedProgressBar value={manualValue[0]} />
        <div className="space-y-2">
          <Slider
            value={manualValue}
            onValueChange={setManualValue}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
