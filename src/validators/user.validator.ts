import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(5, { error: "Password must be at least 5 characters" }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z
    .email("Invalid email address")
    .min(1, { error: "Email is required" }),
  area: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  po: z.string().optional(),
  municipality: z.string().optional(),
  phoneType: z.enum(["phone", "home", "work"]).optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();
