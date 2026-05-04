import { Router } from "express";
import * as conditionsCtrl from "../controllers/conditions.controller";

const router = Router();

/**
 * @openapi
 * /conditions/{county}:
 *   get:
 *     summary: Gets the road conditions by county
 *     description: |
 *        Retrieves current road condition information for a specific county.
 *     tags:
 *       - Road Conditions
 *     parameters:
 *       - in: path
 *         name: county
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the county to retrieve road conditions for
 *
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/"
 *
 *       "404":
 *         $ref: "#/components/responses/"
 */
router.post("/:county", conditionsCtrl.conditions);
router.post("/accidents/:county", conditionsCtrl.accidents);

export default router;
