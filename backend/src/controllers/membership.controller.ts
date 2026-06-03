import { Request, Response, NextFunction } from 'express';
import { membershipService } from '../services/membership.service';

const getPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plans = await membershipService.getAllPlans();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Membership plans retrieved successfully',
      data: { plans },
    });
  } catch (error) {
    next(error);
  }
};

export const membershipController = {
  getPlans,
};
