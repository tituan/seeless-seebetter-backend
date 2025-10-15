import { Router } from "express";
import * as ctrl from "../modules/articles/article.controller.js";

const router = Router();

router.get("/by-category/:category/:slug", ctrl.getOneByCategory); // spécifique d’abord
router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.get("/:slug", ctrl.getOne);
router.patch("/:slug", ctrl.update);
router.delete("/:slug", ctrl.remove);

export default router;