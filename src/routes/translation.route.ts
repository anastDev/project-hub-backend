import { Router } from "express";
import * as translationCtrl from "../controllers/translation.controller";

const router = Router();

router.post("/", translationCtrl.translate);

export default router;