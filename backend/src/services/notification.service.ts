import { prisma } from "../config/prisma";
import { NotificationType } from "@prisma/client";

const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: object,
) => {
  return prisma.notification.create({
    data: { userId, type, title, message, metadata },
  });
};

const getNotifications = async (userId: string, unreadOnly = false) => {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
};

const markAsRead = async (userId: string, notificationId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

const getUnreadCount = async (userId: string) => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

const notifyMembershipActivated = async (userId: string, planName: string) => {
  return createNotification(
    userId,
    "MEMBERSHIP_ACTIVATED",
    "Goi thanh vien da duoc kich hoat",
    `Chuc mung! Goi ${planName} cua ban da duoc kich hoat thanh cong.`,
    { planName },
  );
};

const notifyPaymentSuccess = async (
  userId: string,
  amount: number,
  planName: string,
) => {
  return createNotification(
    userId,
    "PAYMENT_SUCCESS",
    "Thanh toan thanh cong",
    `Ban da thanh toan thanh cong ${amount.toLocaleString("vi-VN")}d cho goi ${planName}.`,
    { amount, planName },
  );
};

const notifyPaymentFailed = async (userId: string, planName: string) => {
  return createNotification(
    userId,
    "PAYMENT_FAILED",
    "Thanh toan that bai",
    `Thanh toan cho goi ${planName} khong thanh cong. Vui long thu lai.`,
    { planName },
  );
};

const notifyMembershipExpiring = async (
  userId: string,
  planName: string,
  daysLeft: number,
) => {
  return createNotification(
    userId,
    "MEMBERSHIP_EXPIRING",
    "Goi thanh vien sap het han",
    `Goi ${planName} cua ban se het han sau ${daysLeft} ngay. Hay gia han de tiep tuc su dung.`,
    { planName, daysLeft },
  );
};

export const notificationService = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  notifyMembershipActivated,
  notifyPaymentSuccess,
  notifyPaymentFailed,
  notifyMembershipExpiring,
};