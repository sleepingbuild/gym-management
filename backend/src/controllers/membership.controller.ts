import { Request, Response, NextFunction } from "express";
import { membershipService } from "../services/membership.service";
import { buyMembershipSchema } from "../validators/membership.validator";

const getPlans = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const plans = await membershipService.getAllPlans();
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Membership plans retrieved successfully",
            data: { plans },
        });
    } catch (error) {
        next(error);
    }
};

const buyMembership = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const validated = buyMembershipSchema.parse(req.body);
        const userId = req.user!.userId;

        const membership = await membershipService.buyMembership(
            userId,
            validated.planId,
        );

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Membership purchased successfully",
            data: { membership },
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentMembership = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const membership = await membershipService.getCurrentMembership(userId);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: membership
                ? "Current membership retrieved"
                : "No active membership",
            data: { membership },
        });
    } catch (error) {
        next(error);
    }
};

export const membershipController = {
    getPlans,
    buyMembership,
    getCurrentMembership,
};
