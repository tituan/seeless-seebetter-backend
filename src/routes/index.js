import { Router } from "express";
import articleRoutes from "./article.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "seeless-seebetter-api" });
});

router.use("/articles", articleRoutes);

export default router;