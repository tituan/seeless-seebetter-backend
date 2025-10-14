import { Router } from "express";
import articleRoutes from "./article.routes.js";
import { CATEGORIES } from "../constants/categories.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "seeless-seebetter-api" });
});

// 👉 endpoint pour alimenter le dropdown du BO
router.get("/categories", (req, res) => {
  res.json({ items: CATEGORIES });
});

router.use("/articles", articleRoutes);

export default router;