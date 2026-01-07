import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateObjectId } from "../middlewares/validate.objectId.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { hasAdminRole } from "../middlewares/user.middleware";

const router = Router();

router.get("/",authenticate , hasAdminRole, userCtrl.list);
router.get("/:id",authenticate, hasAdminRole, userCtrl.getOne);
router.post("/",authenticate, validate(createUserSchema), userCtrl.create);
router.put("/:id", authenticate, validate(updateUserSchema), validateObjectId('id'), userCtrl.update);
router.delete("/:id", authenticate, hasAdminRole, validateObjectId('id'), userCtrl.remove);

export default router;
