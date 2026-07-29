import { Router } from "express";
import { Role } from "@prisma/client";
import { faceController } from "../controllers/face.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// GET /api/face/me — bất kỳ user đã đăng nhập nào cũng xem được descriptor CỦA CHÍNH MÌNH
router.get("/me", authenticate, faceController.getMyProfile);

// Các route còn lại chỉ Admin: đăng ký hộ, quản lý, cấp dữ liệu cho Kiosk
router.use(authenticate, authorize(Role.ADMIN));

router.get("/enrollable-users", faceController.getEnrollableUsers);
router.post("/enroll", faceController.enroll);
router.get("/profiles", faceController.getAllForKiosk);
router.delete("/:userId", faceController.deleteProfile);

export default router;
