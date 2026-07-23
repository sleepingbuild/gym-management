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
 */
router.patch("/users/:id/role", adminController.updateUserRole);

/**
 * @swagger
 * /admin/revenue:
 *   get:
 *     summary: Doanh thu 6 tháng gần nhất (chỉ tính Payment status = SUCCESS)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách doanh thu theo tháng
 */
router.get("/revenue", adminController.getRevenue);

/**
 * @swagger
 * /admin/memberships/distribution:
 *   get:
 *     summary: Số lượng thành viên đang ACTIVE, gộp theo từng gói tập
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Phân bố gói tập
 */
router.get(
    "/memberships/distribution",
    adminController.getMembershipDistribution,
);

/**
 * @swagger
 * /admin/memberships:
 *   get:
 *     summary: Lấy tất cả gói tập (kể cả đã khóa) để quản lý
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách gói tập
 *   post:
 *     summary: Tạo gói tập mới
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.get("/memberships", adminController.getAllMembershipPlans);
router.post("/memberships", adminController.createMembershipPlan);

/**
 * @swagger
 * /admin/memberships/{id}:
 *   put:
 *     summary: Cập nhật gói tập
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
 */
router.put("/memberships/:id", adminController.updateMembershipPlan);

/**
 * @swagger
 * /admin/memberships/{id}/toggle-active:
 *   patch:
 *     summary: Khóa/Mở khóa gói tập
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
 */
router.patch(
    "/memberships/:id/toggle-active",
    adminController.toggleMembershipPlanActive,
);

/**
 * @swagger
 * /admin/memberships/{id}:
 *   delete:
 *     summary: Xóa gói tập (chặn nếu đang có thành viên dùng)
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
 *         description: Xóa thành công
 */
router.delete("/memberships/:id", adminController.deleteMembershipPlan);

/**
 * @swagger
 * /admin/trainers:
 *   get:
 *     summary: Lấy danh sách huấn luyện viên
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách huấn luyện viên
 *   post:
 *     summary: Tạo huấn luyện viên mới (tạo cả tài khoản User role PT)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, specialties]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               specialties: { type: string }
 *               bio: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã tồn tại
 */
router.get("/trainers", adminController.getTrainers);
router.post("/trainers", adminController.createTrainer);

/**
 * @swagger
 * /admin/trainers/{id}:
 *   put:
 *     summary: Cập nhật hồ sơ huấn luyện viên (id là TrainerProfile.id)
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
 *       404:
 *         description: Không tìm thấy huấn luyện viên
 *   delete:
 *     summary: Xóa hồ sơ huấn luyện viên (id là TrainerProfile.id), hạ role User về MEMBER
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
 *         description: Xóa thành công
 *       400:
 *         description: Còn lịch đặt chưa hoàn thành, không thể xóa
 *       404:
 *         description: Không tìm thấy huấn luyện viên
 */
router.put("/trainers/:id", adminController.updateTrainer);
router.delete("/trainers/:id", adminController.deleteTrainer);

export default router;
