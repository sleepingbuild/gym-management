import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get(
    "/stats",
    authenticate,
    authorize("ADMIN"),
    adminController.getStats,
);
router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    adminController.getUsers,
);
router.patch(
    "/users/:id/toggle-active",
    authenticate,
    authorize("ADMIN"),
    adminController.toggleUserActive,
);
router.patch(
    "/users/:id/role",
    authenticate,
    authorize("ADMIN"),
    adminController.updateUserRole,
);

export default router;
