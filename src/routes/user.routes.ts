import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateObjectId } from "../middlewares/validate.objectId.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

const router = Router();

router.get("/", userCtrl.list);
router.get("/:id",userCtrl.getOne);
router.post("/", validate(createUserSchema), userCtrl.create);
router.put("/:id",validate(updateUserSchema), validateObjectId('id'), userCtrl.update);
router.delete("/:id",validateObjectId('id'), userCtrl.remove);

export default router;
