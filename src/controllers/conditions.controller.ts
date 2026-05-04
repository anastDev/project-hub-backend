import { Request, Response, NextFunction } from "express";
import * as conditionsService from "../services/conditions.service";
import { getCountyByCity } from "../utils/countyMapping";

export const conditions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const city = req.params.county as string;

    const lat = parseFloat(req.body.lat);
    const long = parseFloat(req.body.long);

    // console.log(">>Received coordinates:", lat, long);

    if (isNaN(lat) || isNaN(long)) {
    return res.status(400).json({ error: "lat and long must be valid numbers" });
}

    const county = getCountyByCity(city);
    if (!county) {
      return res.status(400).json({
        error: `Unknown city: ${city}`,
      });
    }
    const result = await conditionsService.getRoadConditions(county, lat, long);
    // console.log("Road conditions result: ", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};


export const accidents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const city = req.params.county as string;

    const lat = parseFloat(req.body.lat);
    const long = parseFloat(req.body.long);

    if (isNaN(lat) || isNaN(long)) {
    return res.status(400).json({ error: "lat and long must be valid numbers" });
}

    const county = getCountyByCity(city);
    if (!county) {
      return res.status(400).json({
        error: `Unknown city: ${city}`,
      });
    }

    const result = await conditionsService.getAccidents(county, lat, long);
    //  console.log("Accidents result: ", result);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};
