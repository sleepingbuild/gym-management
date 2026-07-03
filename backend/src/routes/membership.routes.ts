import { Router } from "express";
import { membershipController } from "../controllers/membership.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /memberships/plans:
 *   get:
 *     summary: Lấy danh sách các gói tập
 *     tags: [Membership]
 *     responses:
 *       200:
 *         description: Danh sách gói tập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     plans:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MembershipPlan'
 */
router.get("/plans", membershipController.getPlans);

/**
 * @swagger
 * /memberships/buy:
 *   post:
 *     summary: Mua gói tập
 *     tags: [Membership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mua gói thành công
 *       400:
 *         description: Đã có gói active hoặc plan không tồn tại
 *       401:
 *         description: Chưa đăng nhập
 */
router.post("/buy", authenticate, membershipController.buyMembership);

/**
 * @swagger
 * /memberships/current:
 *   get:
 *     summary: Lấy gói tập hiện tại
 *     tags: [Membership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin gói tập hiện tại
 *       401:
 *         description: Chưa đăng nhập
 */
router.get("/current", authenticate, membershipController.getCurrentMembership);
router.get("/debug-plans", membershipController.debugPlans);

export default router;
