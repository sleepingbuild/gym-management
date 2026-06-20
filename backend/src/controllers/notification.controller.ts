import { Request, Response, NextFunction } from "express";
import { notificationService } from "../services/notification.service";

const getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const unreadOnly = req.query.unreadOnly === "true";
        const notifications = await notificationService.getNotifications(
            userId,
            unreadOnly,
        );
        const unreadCount = await notificationService.getUnreadCount(userId);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Notifications retrieved",
            data: { notifications, unreadCount },
        });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;
        await notificationService.markAsRead(userId, id);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Notification marked as read",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        await notificationService.markAllAsRead(userId);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "All notifications marked as read",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

export const notificationController = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
