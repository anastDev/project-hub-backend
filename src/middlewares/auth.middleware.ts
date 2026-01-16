import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing authentication token",
      code: "UNAUTHORIZED",
    });
  }

  const token = header.split(" ")[1];
  // console.log("Token >>>", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Invalid or expired Token", code: "UNAUTHORIZED" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    // console.log("User", req.user);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", code: "UNAUTHORIZED" });
  }
};
