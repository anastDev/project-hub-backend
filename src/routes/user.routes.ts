import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateObjectId } from "../middlewares/validate.objectId.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { hasAdminRole } from "../middlewares/user.middleware";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "General Error"
 *         code:
 *           type: string
 *           example: "ERROR_CODE"
 * 
 *   responses:
 *     UnauthorizedError:
 *       description: |
 *         **401 Unauthorized**
 *         Authentication token is missing, invalid or expired.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ErrorResponse"
 *           examples:
 *             missingToken:
 *               summary: Missing authentication token
 *               value:
 *                 message: "Authentication token is required"
 *                 code: "UNAUTHORIZED"
 *             invalidToken:
 *               summary: Invalid or expired token
 *               value:
 *                 message: "Invalid or expired authentication token"
 *                 code: "UNAUTHORIZED"
 * 
 *     ForbiddenError:
 *       description: |
 *         **403 Forbidden**
 *         Authenticated user does not have admin privileges.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ErrorResponse"
 *           examples:
 *             adminRequired:
 *               summary: Admin role required
 *               value:
 *                 message: "Admin role required to access this resource"
 *                 code: "FORBIDDEN"
 * 
 *     DatabaseError:
 *       description: |
 *         **503 Service Unavailable**
 *         Database service is temporarily unavailable.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ErrorResponse"
 *           examples:
 *             dbConnectionIssue:
 *               summary: Database connection issue
 *               value:
 *                 message: "Database Connection Issue"
 *                 code: "DATABASE_UNAVAILABLE"
 * 
 *     InternalServerError:
 *       description: |
 *         **500 Internal Server Error**
 *         An unexpected error occurred on the server.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ErrorResponse"
 *           examples:
 *             genericError:
 *               summary: Generic server error
 *               value:
 *                 message: "Internal Server Error"
 *                 code: "INTERNAL_SERVER_ERROR"
 */


/**
 * @openapi
 * /users:
 *   get:
 *     summary: Returns a list of users (Admin only)
 *     description: |
 *       Retrieve all users from the system.
 *       Requires admin privileges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       "401":
 *         $ref: "#/components/responses/UnauthorizedError"
 * 
 *       "403":
 *         $ref: "#/components/responses/ForbiddenError"
 * 
 *       "500":
 *         $ref: "#/components/responses/InternalServerError"
 * 
 *       "503":
 *         $ref: "#/components/responses/DatabaseError"
 */
router.get("/",authenticate, hasAdminRole, userCtrl.list);


router.get("/:id",authenticate, userCtrl.getOne);

router.post("/",authenticate, validate(createUserSchema), userCtrl.create);
router.put("/:id", authenticate, validate(updateUserSchema), validateObjectId('id'), userCtrl.update);
router.delete("/:id", authenticate, hasAdminRole, validateObjectId('id'), userCtrl.remove);

export default router;
