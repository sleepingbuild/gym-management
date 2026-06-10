import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, activeMembers] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.userMembership.count({ where: { status: 'ACTIVE' } }),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Stats retrieved',
      data: {
        totalUsers,
        totalMembers: totalUsers,
        activeMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        userMembership: {
          select: {
            status: true,
            expiryDate: true,
            plan: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users retrieved',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = { getStats, getUsers };