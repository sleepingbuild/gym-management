import { Router } from "express";
import { aiController } from "../controllers/ai.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/chat", authenticate, aiController.chat);
router.get("/history", authenticate, aiController.getChatHistory);
router.get("/usage", authenticate, aiController.getUsage);
router.post("/chat/stream", authenticate, aiController.chatStream);
router.get("/sessions", authenticate, aiController.getSessions);

export default router;
