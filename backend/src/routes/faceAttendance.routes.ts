import { Router } from "express";
import { Role } from "@prisma/client";
import { faceAttendanceController } from "../controllers/faceAttendance.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

// Kiosk — chỉ Admin đứng máy mới được gọi (webcam công cộng, so khớp với tất cả)
router.post("/checkin", authorize(Role.ADMIN), faceAttendanceController.checkIn);

// Self check-in — Trainer hoặc Member tự soi webcam của chính họ
router.post(
    "/checkin/self",
    authorize(Role.PT, Role.MEMBER),
    faceAttendanceController.selfCheckIn,
);

export default router;
