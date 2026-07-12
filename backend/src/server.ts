import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { prisma } from "./config/prisma";
import routes from "./routes";
import { specs } from "./docs/swagger";
import { stream } from "./config/logger";

dotenv.config();

const app = express();

// Security Middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }),
);

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
    /\.vercel\.app$/, // cho phep tat ca preview/production domain cua Vercel
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // cho phep request khong co origin (Postman, curl...)
            const isAllowed = allowedOrigins.some((allowed) =>
                allowed instanceof RegExp
                    ? allowed.test(origin)
                    : allowed === origin,
            );
            callback(null, isAllowed);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

// Logging with Morgan + Winston
app.use(morgan("combined", { stream }));

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// HEALTH CHECK - Detailed
// ============================================
app.get("/api/health", async (req, res) => {
    const startTime = Date.now();
    const health = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        services: {
            database: "unknown",
            api: "ok",
        },
        version: process.env.npm_package_version || "0.1.0",
        environment: process.env.NODE_ENV || "development",
        responseTime: 0,
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = "connected";
        health.responseTime = Date.now() - startTime;
        res.json(health);
    } catch (error) {
        console.error(error);
        health.status = "degraded";
        health.services.database = "disconnected";
        health.responseTime = Date.now() - startTime;
        res.status(503).json(health);
    }
});

// ============================================
// SWAGGER API DOCS
// ============================================
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// ============================================
// API ROUTES
// ============================================
app.use("/api", routes);

// ============================================
// ERROR HANDLING
// ============================================
app.use(errorMiddleware);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        errorCode: "NOT_FOUND_001",
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
    console.log(`🔗 API base: http://localhost:${PORT}/api`);
});

export default app;
