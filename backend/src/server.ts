import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import routes from './routes';

dotenv.config();

const app = express();

app.use(logger);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Backend is running",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      success: false,
      database: "disconnected",
    });
  }
});

app.use('/api', routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});