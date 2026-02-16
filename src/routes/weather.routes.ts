import { Router } from "express";
import * as weatherCtrl from "../controllers/weather.controller";

const router = Router();

/**
 * @openapi
 * /weather/{city}:
 *   get:
 *     summary: Gets the weather by city name
 *     description: |
 *        Retrieves current weather information for a specified city.
 *     tags:
 *       - Weather
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the city to get weather for
 *
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherResponse"
 *
 *       "404":
 *         $ref: "#/components/responses/CityNotFound"
 */
router.get("/:city", weatherCtrl.getWeather);

export default router;