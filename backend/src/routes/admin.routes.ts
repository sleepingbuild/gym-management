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
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch("/users/:id/role", adminController.updateUserRole);

/**
 * @swagger
 * /admin/users/{id}/membership:
 *   patch:
 *     summary: Gán/đổi gói tập cho user, hoặc hủy gói hiện tại (planId null)
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
router.patch("/users/:id/membership", adminController.updateUserMembership);

/**
 * @swagger
 * /admin/revenue:
 *   get:
 *     summary: Doanh thu 6 tháng gần nhất
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
 *     summary: Phân bố thành viên theo gói tập
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
 *     summary: Lấy tất cả gói tập
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
 *     summary: Xóa gói tập
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
 *     summary: Tạo huấn luyện viên mới
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.get("/trainers", adminController.getTrainers);
router.post("/trainers", adminController.createTrainer);

/**
 * @swagger
 * /admin/trainers/{id}:
 *   put:
 *     summary: Cập nhật hồ sơ huấn luyện viên
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
 *   delete:
 *     summary: Xóa hồ sơ huấn luyện viên
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
router.put("/trainers/:id", adminController.updateTrainer);
router.delete("/trainers/:id", adminController.deleteTrainer);

/**
 * @swagger
 * /admin/trainer-schedules:
 *   get:
 *     summary: Lấy lịch làm việc huấn luyện viên (lọc theo trainerId tùy chọn)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách ca làm việc
 *   post:
 *     summary: Tạo ca làm việc mới cho huấn luyện viên
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.get("/trainer-schedules", adminController.getTrainerSchedules);
router.post("/trainer-schedules", adminController.createTrainerSchedule);

/**
 * @swagger
 * /admin/trainer-schedules/bulk:
 *   post:
 *     summary: Tạo hàng loạt ca làm việc cho nhiều huấn luyện viên cùng lúc
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thành công (kèm danh sách bị bỏ qua nếu trùng giờ)
 */
router.post(
    "/trainer-schedules/bulk",
    adminController.bulkCreateTrainerSchedules,
);


/**
 * @swagger
 * /admin/trainer-schedules/{id}:
 *   put:
 *     summary: Cập nhật ca làm việc
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
 *   delete:
 *     summary: Xóa ca làm việc
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
router.put("/trainer-schedules/:id", adminController.updateTrainerSchedule);
router.delete(
    "/trainer-schedules/:id",
    adminController.deleteTrainerSchedule,
);


/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: Lấy toàn bộ lịch đặt trong hệ thống (lọc tùy chọn)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Danh sách lịch đặt
 */
router.get("/bookings", adminController.getBookings);

/**
 * @swagger
 * /admin/bookings/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái lịch đặt
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
router.patch("/bookings/:id/status", adminController.updateBookingStatus);

/**
 * @swagger
 * /admin/payments:
 *   get:
 *     summary: Lịch sử thanh toán toàn hệ thống (lọc tùy chọn) + thống kê
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, REFUNDED]
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Khớp mã giao dịch, nội dung, tên hoặc email người dùng
 *     responses:
 *       200:
 *         description: Danh sách giao dịch + thống kê tổng quan
 */
router.get("/payments", adminController.getPayments);
router.get("/trainer-checkins", adminController.getTrainerCheckins);
router.post("/trainer-checkins", adminController.createTrainerCheckin);
router.delete("/trainer-checkins/:id", adminController.deleteTrainerCheckin);

export default router;