import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
