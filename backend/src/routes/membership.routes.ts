import { Router } from "express";
import { membershipController } from "../controllers/membership.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { cacheMiddleware } from "../middlewares/cache.middleware";

const router = Router();

// Cache plans for 5 minutes (300 seconds)
router.get("/plans", cacheMiddleware(300), membershipController.getPlans);

router.post("/buy", authenticate, membershipController.buyMembership);
router.get("/current", authenticate, membershipController.getCurrentMembership);
router.patch("/cancel", authenticate, membershipController.cancelMembership);

export default router;
