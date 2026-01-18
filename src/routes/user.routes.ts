import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateObjectId } from "../middlewares/validate.objectId.middleware";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/user.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { hasAdminRole } from "../middlewares/user.middleware";

const router = Router();

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
 *          $ref: "#/components/responses/UnauthorizedError"
 *
 *       "403":
 *          $ref: "#/components/responses/ForbiddenError"
 *
 *
 */
router.get("/", authenticate, userCtrl.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Gets a user by ID
 *     description: |
 *       Get detailed information about a single user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *
 *       "400":
 *         $ref: "#/components/responses/BadRequestError"
 *
 *       "401":
 *         $ref: "#/components/responses/UnauthorizedError"
 *
 *       "404":
 *         $ref: "#/components/responses/UserNotFound"
 */
router.get("/:id", authenticate, validateObjectId("id"), userCtrl.getOne);

/**
 * @openapi
 *  /users:
 *    post:
 *      summary: Creates new User
 *      description: |
 *        Create a new user account. Username (min 3 characters) and email must be unique.
 *        Password must be at least 5 characters.
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *
 *      requestBody:
 *        required: true
 *        description: User data for registration
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CreateUser"
 *
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *               $ref: "#/components/schemas/User"
 *
 *        "400":
 *          $ref: "#/components/responses/BadRequestError"
 *
 *        "401":
 *          $ref: "#/components/responses/UnauthorizedError"
 * 
 *        "409":
 *          $ref: "#components/responses/Conflict"
 *
 */
router.post("/", authenticate, validate(createUserSchema), userCtrl.create);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Updates a user by ID
 *     description: Update an existing user's information. Supports partial updates.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 * 
 *     requestBody:
 *       description: User data to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUser"
 * 
 *     responses:
 *       "200":
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 * 
 *       "400":
 *         $ref: "#/components/responses/BadRequestError"
 * 
 *       "401":
 *         $ref: "#/components/responses/UnauthorizedError"
 * 
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 * 
 * 
 */
router.put(
  "/:id",
  authenticate,
  validate(updateUserSchema),
  validateObjectId("id"),
  userCtrl.update
);

/**
 * @openapi
 *  /users/{id}:
 *    delete:
 *      summary: Delete a user by ID (Admin only)
 *      description: |
 *        Permanently remove a user. Only the admin can delete any account. 
 *      tags:
 *        - Users
 *      security: 
 *        - bearerAuth: []
 * 
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 * 
 *      responses: 
 *        "204": 
 *          description: User successfully deleted.
 *          headers:
 *            X-Deleted-User-Id:
 *              description: ID of the deleted user
 *              schema:
 *                type: string
 * 
 *        "400":
 *          $ref: "#/components/responses/BadRequestError"    
 * 
 *        "401":
 *          $ref: "#/components/responses/UnauthorizedError"
 * 
 *        "403":
 *          $ref: "#/components/responses/ForbiddenError"
 * 
 *        "404":
 *          $ref: "#/components/responses/NotFound"
 * 
 */
router.delete(
  "/:id",
  authenticate,
  hasAdminRole,
  validateObjectId("id"),
  userCtrl.remove
);

export default router;
