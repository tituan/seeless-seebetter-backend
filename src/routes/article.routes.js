import { Router } from "express";
import * as ctrl from "../modules/articles/article.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getOne);
router.post("/", ctrl.create);
router.patch("/:slug", ctrl.update);
router.delete("/:slug", ctrl.remove);

// 👉 route pour récupérer un article par catégorie + slug
router.get("/by-category/:category/:slug", ctrl.getOneByCategory);

export default router;