import { Sun, Cloud } from "lucide-react"
import { useState, useEffect } from "react";

// Type for Weatherstack API response
interface WeatherstackResponse {
  request?: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location?: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current?: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
    is_day: string;
  };
  success?: boolean;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

export function WeatherSection() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherstackResponse | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_IP_GEOLOCATION_API_KEY;
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        setCity(data.city);
        if (data.city) {
          // Fetch weather for the detected city
          const weatherstackKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;
          fetch(`https://api.weatherstack.com/current?access_key=${weatherstackKey}&query=${encodeURIComponent(data.city)}&units=f`)
            .then(res => res.json())
            .then((weatherData: WeatherstackResponse) => {
              console.log('Weatherstack API response:', weatherData);
              setWeather(weatherData);
            });
        }
      });
  }, []);

  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="size-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Weather</h2>
          <span className="text-gray-400">/ {city || "..."}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {weather?.current?.weather_descriptions?.[0]?.toLowerCase().includes('sunny') ? (
            <Sun className="size-10 text-yellow-400" />
          ) : weather?.current?.weather_descriptions?.[0]?.toLowerCase().includes('cloud') ? (
            <Cloud className="size-10 text-gray-400" />
          ) : (
            <Sun className="size-10 text-yellow-400" />
          )}
          <div>
            <div className="flex items-end">
              <span className="text-4xl font-bold">
                {weather?.current?.temperature ? `${weather.current.temperature}°F` : "N/A"}
              </span>
              <span className="text-gray-400 ml-2">
                {weather?.current?.weather_descriptions?.[0] ? `(${weather.current.weather_descriptions[0]})` : ""}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              {weather?.current?.feelslike ? `Feels like ${weather.current.feelslike}°F` : ""}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-blue-400">5 mph</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-blue-400">{weather?.current?.humidity ? `${weather.current.humidity}%` : "N/A"}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-yellow-400">UV: {weather?.current?.uv_index ? weather.current.uv_index : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <Cloud className="size-5 text-gray-400" />
          <span className="text-sm w-10">Thu</span>
          <div className="flex-1 h-2 bg-[#232b3d] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400"></div>
          </div>
          <span className="text-sm text-right">79° / 52°</span>
        </div>

        <div className="flex items-center gap-3">
          <Cloud className="size-5 text-gray-400" />
          <span className="text-sm w-10">Fri</span>
          <div className="flex-1 h-2 bg-[#232b3d] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400"></div>
          </div>
          <span className="text-sm text-right">87° / 58°</span>
        </div>
      </div> */}
    </div>
  )
}
