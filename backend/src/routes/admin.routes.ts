import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Tất cả routes đều yêu cầu ADMIN
router.use(authenticate);
router.use(authorize("ADMIN"));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách users
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền admin
 */
router.get("/users", adminController.getUsers);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Lấy thống kê hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền admin
 */
router.get("/stats", adminController.getStats);

/**
 * @swagger
 * /admin/users/{id}/toggle-active:
 *   patch:
 *     summary: Khóa/Mở khóa tài khoản user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Không thể khóa chính mình
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền admin
 */
router.patch("/users/:id/toggle-active", adminController.toggleUserActive);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Cập nhật role của user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEMBER, PT]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Role không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền admin
 */
router.patch("/users/:id/role", adminController.updateUserRole);

export default router;
