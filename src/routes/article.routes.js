import { Router } from "express";
import * as ctrl from "../modules/articles/article.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getOne);
router.post("/", ctrl.create);
router.patch("/:slug", ctrl.update);
router.delete("/:slug", ctrl.remove);

export default router;