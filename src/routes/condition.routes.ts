import { Router } from "express";
import * as conditionsCtrl from "../controllers/conditions.controller";

const router = Router();

router.post("/:county", conditionsCtrl.conditions);

export default router;