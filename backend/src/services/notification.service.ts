import { prisma } from '../config/prisma';
import { NotificationType } from '@prisma/client';

const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: object
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
    orderBy: { createdAt: 'desc' },
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

// Helper functions de tao notification theo tung loai
const notifyMembershipActivated = async (userId: string, planName: string) => {
  return createNotification(
    userId,
    'MEMBERSHIP_ACTIVATED',
    'GÃ³i thÃ nh viÃªn Ä‘Ã£ Ä‘Æ°á»£c kÃ­ch hoáº¡t',
    `ChÃºc má»«ng! GÃ³i ${planName} cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c kÃ­ch hoáº¡t thÃ nh cÃ´ng.`,
    { planName }
  );
};

const notifyPaymentSuccess = async (userId: string, amount: number, planName: string) => {
  return createNotification(
    userId,
    'PAYMENT_SUCCESS',
    'Thanh toÃ¡n thÃ nh cÃ´ng',
    `Báº¡n Ä‘Ã£ thanh toÃ¡n thÃ nh cÃ´ng ${amount.toLocaleString('vi-VN')}Ä‘ cho gÃ³i ${planName}.`,
    { amount, planName }
  );
};

const notifyPaymentFailed = async (userId: string, planName: string) => {
  return createNotification(
    userId,
    'PAYMENT_FAILED',
    'Thanh toÃ¡n tháº¥t báº¡i',
    `Thanh toÃ¡n cho gÃ³i ${planName} khÃ´ng thÃ nh cÃ´ng. Vui lÃ²ng thá»­ láº¡i.`,
    { planName }
  );
};

const notifyMembershipExpiring = async (userId: string, planName: string, daysLeft: number) => {
  return createNotification(
    userId,
    'MEMBERSHIP_EXPIRING',
    'GÃ³i thÃ nh viÃªn sáº¯p háº¿t háº¡n',
    `GÃ³i ${planName} cá»§a báº¡n sáº½ háº¿t háº¡n sau ${daysLeft} ngÃ y. HÃ£y gia háº¡n Ä‘á»ƒ tiáº¿p tá»¥c sá»­ dá»¥ng.`,
    { planName, daysLeft }
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