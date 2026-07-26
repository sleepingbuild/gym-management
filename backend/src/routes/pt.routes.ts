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

router.get(
    "/checkin/today",
    authenticate,
    authorize(Role.PT),
    ptController.getCheckinToday,
);
router.get(
    "/checkin/history",
    authenticate,
    authorize(Role.PT),
    ptController.getCheckinHistory,
);
router.post(
    "/checkin",
    authenticate,
    authorize(Role.PT),
    ptController.createCheckin,
);

router.get(
    "/clients",
    authenticate,
    authorize(Role.PT),
    ptController.getMyClients,
);
router.get(
    "/clients/progress",
    authenticate,
    authorize(Role.PT),
    ptController.getMyClientsProgress,
);
router.get(
    "/dashboard",
    authenticate,
    authorize(Role.PT),
    ptController.getMyDashboard,
);
export default router;