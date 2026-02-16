import { Request, Response, NextFunction } from "express";
import * as conditionsService from "../services/conditions.service";
import { getCountyByCity } from "../utils/countyMapping";

export const conditions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const city= req.params.county as string;

    const county = getCountyByCity(city);
    if(!county) {
      return res.status(400).json({
        error: `Unknown city: ${city}`
      })
    }
    const result = await conditionsService.getRoadConditions(county);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}