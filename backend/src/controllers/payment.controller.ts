import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services/payment.service";
import { z } from "zod";
import { AppError } from "../utils/errors";
import { prisma } from "../config/prisma";

const createPaymentSchema = z.object({
    planId: z.string().min(1, "PAYMENT_003: Plan ID is required"),
    paymentMethod: z.enum(["VNPAY", "MOMO"]),
});

const createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { planId, paymentMethod } = createPaymentSchema.parse(req.body);
        const userId = req.user!.userId;

        // Lay IP address
        const ipAddr =
            (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
            req.socket.remoteAddress ||
            "127.0.0.1";

        // Lay amount tu plan
        const plan = await prisma.membershipPlan.findFirst({
            where: { id: planId, isActive: true },
        });
        if (!plan) throw new AppError(404, "PAYMENT_001: Plan not found");
        if (plan.price === 0)
            throw new AppError(
                400,
                "PAYMENT_004: Basic plan is free, use /memberships/buy",
            );

        let result;
        if (paymentMethod === "VNPAY") {
            result = await paymentService.createVNPayUrl(
                userId,
                planId,
                plan.price * 1000,
                ipAddr,
            );
        } else {
            result = await paymentService.createMoMoUrl(
                userId,
                planId,
                plan.price * 1000,
            );
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Payment URL created",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const vnpayReturn = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const query = req.query as Record<string, string>;
        const result = await paymentService.verifyVNPayReturn(query);

        if (result.success) {
            res.redirect(
                `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success?paymentId=${result.paymentId}`,
            );
        } else {
            res.redirect(
                `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/failed?paymentId=${result.paymentId}`,
            );
        }
    } catch (error) {
        next(error);
    }
};

const momoWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await paymentService.verifyMoMoWebhook(req.body);
        res.status(200).json({ success: result.success });
    } catch (error) {
        next(error);
    }
};

const getPaymentHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const result = await paymentService.getPaymentHistory(userId);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Payment history retrieved",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const paymentController = {
    createPayment,
    vnpayReturn,
    momoWebhook,
    getPaymentHistory,
};
