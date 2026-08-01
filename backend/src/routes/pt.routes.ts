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
router.patch(
    "/bookings/:id/status",
    authenticate,
    authorize(Role.PT),
    ptController.updateBookingStatus,
);
router.get("/stats", authenticate, authorize(Role.PT), ptController.getMyStats);

// Chấm công thủ công đã bị loại bỏ — chỉ dùng /api/face-attendance/checkin/self
// (xem faceAttendance.routes.ts). Không còn "/checkin/today", "/checkin/history",
// "/checkin" ở đây nữa.

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