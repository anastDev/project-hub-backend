import User, { IUser } from "../models/user.model";
import Role from "../models/role.model";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

const SALT_ROUNDS = 10;

export const findAllUsers = async () => {
  return User.find().populate('roles').lean();
};

export const findUserById = async(id: string) => {
  return User.findById(id).populate("roles").lean();
}

export const createUser = async (payload: Partial<IUser>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }

  let reader = await Role.findOne({ role: "READER" });
  if (!reader) {
    reader = await Role.create({
      role: "READER",
      description: "Role Reader",
      active: true,
    });
  }
  const user = new User({...payload, roles: reader});
  return user.save();
};

export const updateUser = async(id: string, payload: Partial<IUser>) => {
  if(payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }
  return User.findByIdAndUpdate(id, payload, {new: true}).populate('roles');
}

export const deleteUser = async(id: string) => {
  return User.findByIdAndDelete(id);
}
