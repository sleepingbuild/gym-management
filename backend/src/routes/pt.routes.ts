import { Router } from "express";
import { Role } from "@prisma/client";
import { ptController } from "../controllers/pt.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Tat ca routes chi danh cho role PT
router.get(
    "/students",
    authenticate,
    authorize(Role.PT),
    ptController.getMyStudents,
);
router.get(
    "/bookings",
    authenticate,
    authorize(Role.PT),
    ptController.getMyBookings,
);
router.get("/stats", authenticate, authorize(Role.PT), ptController.getMyStats);

export default router;