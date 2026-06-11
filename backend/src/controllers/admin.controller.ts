import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { Role } from '@prisma/client';

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
      data: { totalUsers, totalMembers: totalUsers, activeMembers },
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
        phone: true,
        role: true,
        isActive: true,
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

const toggleUserActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
    if (!user) throw new AppError(404, 'USER_001: User not found');
    if (user.id === req.user!.userId) throw new AppError(400, 'USER_002: Cannot lock your own account');

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, fullName: true, email: true, isActive: true },
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: updated.isActive ? 'User unlocked' : 'User locked',
      data: { user: updated },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const role = req.body.role as string;
    if (!['ADMIN', 'PT', 'MEMBER'].includes(role)) throw new AppError(400, 'USER_003: Invalid role');

    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
    if (!user) throw new AppError(404, 'USER_001: User not found');

    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, fullName: true, email: true, role: true },
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User role updated',
      data: { user: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = { getStats, getUsers, toggleUserActive, updateUserRole };