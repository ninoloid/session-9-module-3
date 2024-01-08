import { NextFunction, Response } from "express";

export default async (req: any, res: Response, next: NextFunction) => {
  const { isAdmin } = req;

  if (!isAdmin) {
    return res.status(403).json({
      code: 403,
      message: "You are not allowed to access this endpoint",
    });
  }

  next();
};
