import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import roleRoutes from "./routes/role.routes";
import authRoutes from "./routes/auth.routes";
import weatherRoutes from "./routes/weather.routes";
import conditionRoutes from "./routes/condition.routes";
import movieRoutes from "./routes/movie.routes";
import generatorRoutes from "./routes/generator.routes";

import { setupSwagger } from "./swagger";

const app = express();

setupSwagger(app);

app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://anastdev.github.io",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes)
app.use("/api/conditions", conditionRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/generator", generatorRoutes);

export default app;
