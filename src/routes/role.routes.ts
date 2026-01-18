import { Router } from "express";
import * as roleCtrl from "../controllers/role.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateObjectId } from "../middlewares/validate.objectId.middleware";
import {
  createRoleSchema,
  updateRoleSchema,
} from "../validators/role.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { hasAdminRole } from "../middlewares/user.middleware";

const router = Router();

/**
 * @openapi
 *  /roles:
 *    get:
 *      summary: Returns a list of all roles (Admin Only)
 *      tags: 
 *        - Roles
 *      security:
 *        -bearerAuth: []
 * 
 *      responses: 
 *        "200":
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema: 
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Role"
 * 
 *        "401":
 *           $ref: "#/components/responses/UnauthorizedError"
 * 
 *        "403":
 *          $ref: "#/components/responses/ForbiddenError"
 *              
 */
router.get("/", authenticate, hasAdminRole, roleCtrl.list);

/**
 * @openapi
 *  /roles:
 *    post:
 *      summary: Create a new role (Admin only)
 *      tags: 
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      
 *      requestBody:
 *        required: true
 *        description: Role data for creating a role
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CreateRole"
 *      
 *      responses: 
 *        "201":
 *          description: Role successfully created
 *          content: 
 *            application/json:
 *              schema: 
 *                $ref: "#/components/schemas/Role"
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
 *        "409":
 *          $ref: "#components/responses/Conflict"
 * 
 */
router.post("/", authenticate, hasAdminRole, validate(createRoleSchema), roleCtrl.create);

/**
 * @openapi
 *  /roles/{id}:
 *    put:
 *      summary: Update a role by ID (Admin only)
 *      description: |
 *        Update an existing role's information. Admin role required.
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 * 
 *      parameters: 
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: objectid
 *          description: Role ID
 *      
 *      requestBody:
 *        description: Role data to update partially
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: "#/components/schemas/UpdateRole"
 * 
 *      responses:
 *        "200":
 *          description: Role updated successfully
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Role"
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
router.put(
  "/:id",
  authenticate,
  validate(updateRoleSchema),
  validateObjectId("id"),
  hasAdminRole,
  roleCtrl.update
);

/**
 * @openapi
 *  /roles/{id}:
 *    delete: 
 *      summary: Delete a role by ID (Admin only)
 *      description: |
 *        Permanently delete a role. Admin role required.
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 * 
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: objectid
 *          description: Role ID to delete
 *      
 *      responses:
 *        "204":
 *          description: Role successfully deleted
 *          headers:
 *            X-Deleted-Role-Id:
 *              description: ID of the deleted role
 *              schema:
 *                type: string
 *              example: "507f1f77bcf86cd799439011"
 * 
 *        "400":
 *          $ref: "#/components/responses/BadRequestError"
 * 
 *        "401":
 *          $ref: "#/components/responses/UnauthorizedError"
 * 
 *        "404":
 *          $ref: "#/components/responses/NotFound"
 * 
 */
router.delete(
  "/:id",
  authenticate,
  validateObjectId("id"),
  hasAdminRole,
  roleCtrl.remove
);

export default router;
