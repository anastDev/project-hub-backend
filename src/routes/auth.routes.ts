import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth.validator";

const router = Router();

/**
 * @openapi
 *  /auth/login:
 *    post:
 *      summary: Login user
 *      tags: 
 *        - Auth
 *      
 *      requestBody:
 *        required: true
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/LoginResponse"
 * 
 *      responses:
 *        "200": 
 *          description: Login successful
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/LoginResponse"
 * 
 *        "400":
 *          $ref: "#/components/responses/BadRequestError"
 * 
 *        "401":
 *          $ref: "#/components/responses/UnauthorizedError"
 * 
 */
router.post("/login", validate(loginSchema), authCtrl.login);

export default router;