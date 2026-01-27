import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import roleRoutes from "./routes/role.routes";
import authRoutes from "./routes/auth.routes";

import { setupSwagger } from "./swagger";

const app = express();

setupSwagger(app);

app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://anastdev.github.io/react-projects-hub",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
    allowedHeaders: ["Content-type", "Authorization"],
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);

export default app;
