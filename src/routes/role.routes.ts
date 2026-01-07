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

router.get("/", authenticate, hasAdminRole, roleCtrl.list);
router.post("/", authenticate, validate(createRoleSchema), roleCtrl.create);
router.put(
  "/:id",
  authenticate,
  validate(updateRoleSchema),
  validateObjectId("id"),
  hasAdminRole,
  roleCtrl.update
);
router.delete(
  "/:id",
  authenticate,
  validateObjectId("id"),
  hasAdminRole,
  roleCtrl.remove
);

export default router;
