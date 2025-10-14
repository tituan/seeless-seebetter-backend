import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB, dbState } from "./config/db.js";
import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api", routes);

// health DB
app.get("/health/db", (req, res) => {
  const stateMap = ["disconnected", "connected", "connecting", "disconnecting", "unauthorized"];
  res.json({ dbState: dbState(), state: stateMap[dbState()] || "unknown" });
});

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// start
const PORT = process.env.PORT || 5001;
const URI = process.env.CONNECTION_STRING;

connectDB(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API prête sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Impossible de démarrer:", err);
    process.exit(1);
  });