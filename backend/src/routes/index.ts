import { Router } from "express";
import authRoutes from "./auth.routes";
import membershipRoutes from "./membership.routes";
import aiRoutes from "./ai.routes";
import adminRoutes from "./admin.routes";
import paymentRoutes from "./payment.routes";
import notificationRoutes from "./notification.routes";
import bodyProgressRoutes from "./bodyProgress.routes";
import bodyGoalRoutes from "./bodyGoal.routes";
import ptRoutes from "./pt.routes";
import bookingRoutes from "./booking.routes";
import faceRoutes from "./face.routes";
import faceAttendanceRoutes from "./faceAttendance.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/memberships", membershipRoutes);
router.use("/ai", aiRoutes);
router.use("/admin", adminRoutes);
router.use("/payments", paymentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/body-progress", bodyProgressRoutes);
router.use("/body-goal", bodyGoalRoutes);
router.use("/pt", ptRoutes);
router.use("/bookings", bookingRoutes);
router.use("/face", faceRoutes);
router.use("/face-attendance", faceAttendanceRoutes);

export default router;
