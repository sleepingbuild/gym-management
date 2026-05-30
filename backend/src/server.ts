import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./config/logger";

dotenv.config();

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(helmet());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
