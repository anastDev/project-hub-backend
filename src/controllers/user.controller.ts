import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.findAllUsers();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    const result = await userService.findUserById(userId);
    if (!result) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
        code: "UNAUTHORIZED",
        userId: userId,
      });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email } = req.body;
    const existingUser = await userService.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username";
      return res.status(409).json({
        message: `User with ${conflictField} already exists`,
        code: "CONFLICT",
      });
    }

    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    const updatedData = req.body;

    const existingUser = await userService.findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
        code: "NOT_FOUND"
      });
    }

    const result = await userService.updateUser(userId, updatedData);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    const existingUser = await userService.findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
        code: "UNAUTHORIZED",
        userId: userId,
      });
    }
    const result = await userService.deleteUser(userId);
    res.set("X-Deleted-User-Id", userId).status(204).send();
  } catch (err) {
    next(err);
  }
};
