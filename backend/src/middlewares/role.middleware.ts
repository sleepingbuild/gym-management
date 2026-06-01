
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../utils/errors';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'AUTH_006: Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden: insufficient permissions'));
    }

    next();
  };
};
