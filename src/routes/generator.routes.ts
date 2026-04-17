import { Router } from "express";
import * as generatorCtrl from "../controllers/generator.controller";

const router = Router();

router.post("/", generatorCtrl.generate);
router.post("/explain", generatorCtrl.explain);

export default router;