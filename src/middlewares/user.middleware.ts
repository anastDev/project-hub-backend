import { Request, Response, NextFunction } from "express";
import { IRole } from "../models/role.model";

export const hasAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkAdminRole = req.user.roles.filter(
      (r: IRole) => r.role == "ADMIN" && r.active
    );
    if (!checkAdminRole) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions",
        code: "FORBIDDEN",
      });
    }
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Admin Role Required",
      code: "FORBIDDEN",
    });
  }
};
