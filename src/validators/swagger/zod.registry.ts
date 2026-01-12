import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createUserSchema, updateUserSchema } from "../user.validator";

const registry = new OpenAPIRegistry();

export const CreateUserApi = registry.register("CreateUserSchema", createUserSchema);

export const UpdateUserApi = registry.register("UpdateUserSchema", updateUserSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
export const zodComponents = generator.generateComponents();
