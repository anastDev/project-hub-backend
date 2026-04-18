import { Router } from "express";
import * as healthCtrl from "../controllers/health.controller";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check health status
 *     description: Returns server uptime, response time, and a status message.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HealthCheck"
 *       503:
 *         description: Service unavailable
 */
router.get("/", healthCtrl.healthCheck);

export default router;