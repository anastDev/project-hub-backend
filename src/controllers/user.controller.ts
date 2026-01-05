import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const list = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.findAllUsers(); 
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({"Error": err});
  }
}

export const create = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result = userService.createUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({"Error": err});
  }
}