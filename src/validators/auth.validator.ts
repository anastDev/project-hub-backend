import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(5, { message: "Password must be at least 5 characters" }),
});

export type LoginFields = z.infer<typeof loginSchema>;