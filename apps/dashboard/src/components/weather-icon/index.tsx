import { RainIcon, SunIcon,CloudIcon } from "../icons";

/**
 * Returns a weather icon component based on the weather description.
 * Defaults to CloudIcon if no match is found.
 */
export function WeatherIcon(description?: string | undefined) {
    if (!description) return <CloudIcon />;
    const desc = description.toLowerCase();
    if (desc.includes('sun')) return <SunIcon />;
    if (desc.includes('rain')) return <RainIcon />;
    if (desc.includes('cloud')) return <CloudIcon />;
    // Add more mappings as needed
    return <CloudIcon />;
  }
  