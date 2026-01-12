import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const list = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.findAllUsers(); 
    res.status(200).json(result);
  } catch (err: any) {
    if (err.code === 89) {
      return res.status(503).json({
        message: "Database Connection Issue",
        code: "DATABASE_UNAVAILABLE"
      })
    }

    return res.status(500).json({
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    })
  }
}

export const getOne = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.findUserById(req.params.id!);
    if (!result) {
      return res.status(404).json({message: "User not found"}); 
    }
    res.status(200).json(result);
  } catch (err) {
     res.status(401).json({"Error": err});
  }
 }

export const create = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(401).json({"Error": err});
  }
}

export const update = async(req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await userService.updateUser(req.params.id!, req.body);
     res.status(201).json(result);
  } catch (err) {
     res.status(401).json({"Error": err});
  }
}

export const remove = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.deleteUser(req.params.id!);
    res.status(201).json(result);
  } catch(err) {
    res.status(401).json({"Error": err});
  }
}