import { Sun, Cloud } from "lucide-react"
import { useEffect } from "react";
import { useWeatherStore } from "../../stores/weatherStore";
import { WeatherIcon } from "../weather-icon";

export function WeatherSection() {
  const { city, weather, loading, error, fetchCityAndWeather } = useWeatherStore();

  useEffect(() => {
    if (!city && !weather && !loading && !error) {
      fetchCityAndWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="size-5 text-yellow-400" />
          <h2 className="text-xl font-semibold ">Weather</h2>
          <span className="text-gray-400">/ {city || "..."}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        {typeof weather?.weather_descriptions?.[0] === 'string' ? WeatherIcon(weather.weather_descriptions[0]) : <Cloud />}

          <div>
            <div className="flex items-end">
              <span className="text-2xl font-bold">
                {weather?.temperature ? `${weather.temperature}°F` : loading ? "Loading..." : "N/A"}
              </span>
              <span className="text-gray-400 ml-2">
                {weather?.weather_descriptions?.[0] ? `(${weather.weather_descriptions[0]})` : ""}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              {weather?.feelslike ? `Feels like ${weather.feelslike}°F` : ""}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-blue-400">5 mph</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-blue-400">{weather?.humidity ? `${weather.humidity}%` : "N/A"}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-yellow-400">UV: {weather?.uv_index ? weather.uv_index : "N/A"}</span>
          </div>
        </div>
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  )
}





