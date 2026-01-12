import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { createUserSchema, updateUserSchema } from "../user.validator";
import { createRoleSchema, updateRoleSchema } from "../role.validator";

const registry = new OpenAPIRegistry();

export const CreateUserApi = registry.register("CreateUserSchema", createUserSchema);

export const UpdateUserApi = registry.register("UpdateUserSchema", updateUserSchema);

export const CreateRoleApi = registry.register("CreateRole", createRoleSchema);

export const UpdateRoleApi = registry.register("UpdateRole", updateRoleSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
export const zodComponents = generator.generateComponents();
