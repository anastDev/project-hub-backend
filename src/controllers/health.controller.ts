import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

type DependencyStatus = "up" | "down";

interface HealthPayload {
  status: "healthy" | "degraded";
  uptime: number;
  responseTimeMs: number;
  timestamp: string;
  dependencies: {
    database: DependencyStatus;
  };
  message?: string;
}

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = process.hrtime.bigint();

  const payload: HealthPayload = {
    status: "healthy",
    uptime: process.uptime(),
    responseTimeMs: 0,
    timestamp: new Date().toISOString(),
    dependencies: {
      database: "down",
    },
  };

  try {
    const db = mongoose.connection.db;
    const dbConnected = mongoose.connection.readyState === 1 && !!db;

    if (dbConnected) {
      await Promise.race([
        db.admin().ping(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB ping timeout")), 2000),
        ),
      ]);
      payload.dependencies.database = "up";
    }

    const healthy = payload.dependencies.database === "up";
    payload.status = healthy ? "healthy" : "degraded";
    payload.responseTimeMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;

    res.status(healthy ? 200 : 503).json(payload);
  } catch (error) {
    payload.status = "degraded";
    payload.dependencies.database = "down";
    payload.message = error instanceof Error ? error.message : "Unknown error";
    payload.responseTimeMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;

    res.status(503).json(payload);
    next(error);
  }
};
