import dotenv from "dotenv";
import { WeatherApiResponse } from "../models/weather.model";
dotenv.config();

const WEATHER_API = process.env.WEATHER_API || "";
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "";

export const getCurrentWeatherByCity = async (
  city: string,
): Promise<WeatherApiResponse> => {
  try {
    const res = await fetch(
      `${WEATHER_API}weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`,
    );

    console.log("Response status", res.status);

    if (!res.ok) {
      throw new Error(`Failed to fetch weather ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.log("Error fetching weather: ", err);
    throw err;
  }
};
