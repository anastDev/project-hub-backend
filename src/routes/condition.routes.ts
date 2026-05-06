import { Router } from "express";
import * as conditionsCtrl from "../controllers/conditions.controller";

const router = Router();

/**
 * @openapi
 * /conditions/{county}:
 *   post:
 *     summary: Get road conditions near the user's location
 *     description: |
 *       Fetches current road conditions for the given county from Trafikverket
 *       and filters them to only return records within 1km of the user's
 *       coordinates. Coordinates are provided in the request body.
 *     tags:
 *       - Conditions
 *     parameters:
 *       - in: path
 *         name: county
 *         required: true
 *         schema:
 *           type: string
 *         description: City name used to resolve the Swedish county code (e.g. "gothenburg")
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - long
 *             properties:
 *               lat:
 *                 type: number
 *                 description: User's latitude in WGS84
 *                 example: 57.7089
 *               long:
 *                 type: number
 *                 description: User's longitude in WGS84
 *                 example: 11.9746
 *     responses:
 *       "200":
 *         description: Array of road conditions within 1km of the user's location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/RoadCondition"
 * 
 *       "400":
 *         $ref: "#/components/responses/BadRequestError"
 * 
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 * 
 *       "500":
 *         $ref: "#/components/responses/InternalServerError"
 */
router.post("/:county", conditionsCtrl.conditions);

/**
 * @openapi
 * /conditions/accidents/{county}:
 *   post:
 *     summary: Get nearby incidents and roadworks
 *     description: |
 *       Fetches active traffic situations (accidents, roadworks, incidents)
 *       for the given county from Trafikverket's Situation API and filters
 *       them to only return deviations within 8km of the user's coordinates.
 *       Each Situation record is flattened to its Deviation array before filtering.
 *     tags:
 *       - Conditions
 *     parameters:
 *       - in: path
 *         name: county
 *         required: true
 *         schema:
 *           type: string
 *         description: City name used to resolve the Swedish county code (e.g. "gothenburg")
 *         example: gothenburg
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - long
 *             properties:
 *               lat:
 *                 type: number
 *                 description: User's latitude in WGS84
 *                 example: 57.7089
 *               long:
 *                 type: number
 *                 description: User's longitude in WGS84
 *                 example: 11.9746
 * 
 *     responses:
 *       "200":
 *         description: Array of deviation records within 8km of the user's location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Deviation"
 * 
 *       "400":
 *         $ref: "#/components/responses/BadRequestError"
 * 
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 * 
 *       "500":
 *         $ref: "#/components/responses/InternalServerError"
 */
router.post("/accidents/:county", conditionsCtrl.accidents);

export default router;
