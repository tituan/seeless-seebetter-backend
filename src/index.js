import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ✅ Autorise les appels depuis ton front (localhost:3000)
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: false,
}));

app.use(express.json());
app.use(morgan("dev"));

// ✅ Connecte à MongoDB
await connectDB(process.env.MONGODB_URI);

// ✅ Routes API
app.use("/api", apiRouter);

// ✅ Middlewares d’erreur
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`🚀 API prête sur http://localhost:${port}`);
});