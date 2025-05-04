/**
 * Zustand Weather Store
 *
 * This store manages weather and location data for the dashboard app.
 * It fetches the user's city using the IP Geolocation API, then retrieves current weather data
 * for that city from the Weatherstack API. The store exposes weather info, city, and localtime,
 * as well as loading and error states. Components can use this store to access up-to-date weather
 * information and trigger a refresh by calling fetchCityAndWeather().
 *
 * Usage:
 *   import { useWeatherStore } from "@/stores/weatherStore";
 *   const { city, localtime, weather, loading, error, fetchCityAndWeather } = useWeatherStore();
 */
import { create } from 'zustand';

interface WeatherData {
  city: string;
  localtime: string | null;
  weather: {
    temperature: number;
    weather_icons: string[];
    weather_descriptions: string[];
    feelslike: number;
    humidity: number;
    uv_index: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface WeatherStore extends WeatherData {
  fetchCityAndWeather: () => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  city: '',
  localtime: null,
  weather: null,
  loading: false,
  error: null,
  fetchCityAndWeather: async () => {
    set({ loading: true, error: null });
    try {
      const apiKey = import.meta.env.VITE_IP_GEOLOCATION_API_KEY;
      const geoRes = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`);
      const geoData = await geoRes.json();
      const city = geoData.city;
      if (city) {
        const weatherstackKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;
        const weatherRes = await fetch(`https://api.weatherstack.com/current?access_key=${weatherstackKey}&query=${encodeURIComponent(city)}&units=f`);
        const weatherData = await weatherRes.json();
        set({
          city,
          localtime: weatherData.location?.localtime || null,
          weather: weatherData.current ? {
            temperature: weatherData.current.temperature,
            weather_icons: weatherData.current.weather_icons,
            weather_descriptions: weatherData.current.weather_descriptions,
            feelslike: weatherData.current.feelslike,
            humidity: weatherData.current.humidity,
            uv_index: weatherData.current.uv_index,
          } : null,
          loading: false,
          error: weatherData.success === false ? weatherData.error?.info || 'Weather fetch error' : null,
        });
      } else {
        set({ loading: false, error: 'City not found' });
      }
    } catch (e: unknown) {
      let message = 'Unknown error';
      if (typeof e === 'object' && e !== null && 'message' in e) {
        const err = e as { message?: string };
        if (typeof err.message === 'string') {
          message = err.message;
        }
      }
      set({ loading: false, error: message });
    }
  },
})); 