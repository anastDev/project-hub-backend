import { Request, Response, NextFunction } from "express";
import * as weatherService from "../services/weather.service";

export const getWeather = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { city } = req.params;

    const isValidCity = /^[a-zA-ZÀ-ÿ\s\-']+$/.test(city!);

    if (!city || typeof city !== "string" || !isValidCity) {
      return res.status(400).json({
        message: `Invalid city name`,
        code: "INVALID_CITY_NAME",
      });
    }
    const result = await weatherService.getCurrentWeatherByCity(city);

    if (!result) {
      return res.status(404).json({
        message: `Weather for city with name ${city} not found`,
        code: "CITY_NOT_FOUND",
      });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
