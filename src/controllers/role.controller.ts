import { Request, Response, NextFunction } from "express";
import * as roleService from "../services/role.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await roleService.findAllRoles();
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
    const { role } = req.body;

    const existingRole = await roleService.findRoleByName(role);
    if (existingRole) {
      return res.status(409).json({
        message: `Role ${role} already exists`,
        code: "CONFLICT",
      });
    }
    const result = await roleService.createRole(req.body);
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
    const roleId = req.params.id!;
    const updateData = req.body;

    const existingRole = await roleService.findRoleById(roleId);
    if (!existingRole) {
      return res.status(404).json({
        message: `Role with ID ${roleId} not found`,
        code: "NOT_FOUND",
      });
    }
    const result = await roleService.updateRole(roleId, updateData);
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
    const roleId = req.params.id!;
    const result = await roleService.removeRole(roleId);
    res.set("X-Deleted-Role-Id", roleId).status(204).send();
  } catch (err) {
    next(err);
  }
};
