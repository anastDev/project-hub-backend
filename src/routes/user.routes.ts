import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateObjectId } from "../middlewares/validate.objectId.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/",authenticate , userCtrl.list);
router.get("/:id",authenticate, userCtrl.getOne);
router.post("/",authenticate, validate(createUserSchema), authenticate, userCtrl.create);
router.put("/:id", authenticate, validate(updateUserSchema), validateObjectId('id'), authenticate, userCtrl.update);
router.delete("/:id", authenticate, validateObjectId('id'), userCtrl.remove);

export default router;
