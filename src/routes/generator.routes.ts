import { Router } from "express";
import * as generatorCtrl from "../controllers/generator.controller";

const router = Router();

/**
 * @openapi
 * /generator:
 *   post:
 *     summary: Generate content based on code changes
 *     description: |
 *       Compares previous and new code and generates content (e.g. commit message or explanation).
 *     tags:
 *       - Generator
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prevCode
 *               - newCode
 *             properties:
 *               prevCode:
 *                 type: string
 *                 description: The previous version of the code
 *                 example: "const a = 1;"
 *               newCode:
 *                 type: string
 *                 description: The updated version of the code
 *                 example: "const a = 2;"
 *               context:
 *                 type: string
 *                 description: Optional context for generation (e.g. 'commit message')
 *                 example: "Generate a commit message"
 *
 *     responses:
 *       "200":
 *         description: Content generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GeneratorResponse"
 *
 *       "400":
 *         description: Missing code parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseError"
 *             example:
 *               message: "Previous code parameter is required"
 *               code: "PREV_CODE_REQUIRED"
 */
router.post("/", generatorCtrl.generate);

/**
 * @openapi
 * /generator/explain:
 *   post:
 *     summary: Explain code
 *     description: |
 *       Takes code as input and returns an explanation.
 *       Optionally accepts a question for more specific clarification.
 *     tags:
 *       - Generator
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: The code to explain
 *                 example: "const sum = (a, b) => a + b;"
 *               question:
 *                 type: string
 *                 description: Optional question about the code
 *                 example: "What does this function do?"
 *
 *     responses:
 *       "200":
 *         description: Code explained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code explained successfully
 *                 data:
 *                   type: string
 *                   example: "This function returns the sum of two numbers."
 *
 *       "400":
 *         $ref: "#/components/responses/BadRequestError"
 */
router.post("/explain", generatorCtrl.explain);

export default router;