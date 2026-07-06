import { Router } from "express";
import { attendanceController } from "../controllers/attendance.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Generate QR code for check-in
router.get("/qr", attendanceController.generateQR);

// Check-in
router.post("/check-in", attendanceController.checkIn);

// Check-out
router.post("/check-out", attendanceController.checkOut);

// Get attendance history
router.get("/history", attendanceController.getHistory);

// Get attendance stats
router.get("/stats", attendanceController.getStats);

export default router;
