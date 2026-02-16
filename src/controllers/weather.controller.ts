import { Request, Response, NextFunction } from "express";
import * as weatherService from "../services/weather.service";

export const getWeather = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { city } = req.params;

    if (!city) {
     return res.status(404).json({
      message: `City with name ${city} not found`,
      code: "CITY_NOT_FOUND"
     });
    }
    const result = await weatherService.getCurrentWeatherByCity(city);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
