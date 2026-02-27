import { Router } from "express";
import * as movieCtrl from "../controllers/movie.controller";

const router = Router();

router.get(":title", movieCtrl.list);

export default router;