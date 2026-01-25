import { TestServer } from "./testSetup";
import authRoutes from "../routes/auth.routes";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { describe } from "node:test";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const server = new TestServer();
server.app.use("/auth", authRoutes);

let userId: string;
let testUserData: any;

beforeAll(async () => {
  await server.start();

  const hash = await bcrypt.hash("admin1234", 10);
  const user = await User.create({
    username: "admin",
    password: hash,
    firstname: "testUser",
    lastname: "testUser",
    email: "testUser@email.com",
  });

  userId = user._id.toString();
  testUserData = user.toObject();
});

afterAll(async () => {
  await server.stop();
});

describe("AUTH Api Tests", () => {
  test("POST /auth/login -> returns 200 with token for valid credentials", async () => {
    const loginData = {
      username: "admin",
      password: "admin1234",
    };

    const res = await server.request.post("/auth/login").send(loginData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe("admin");
  });

  test("POST /auth/login -> returns 200 for correct user data in token", async () => {
    const loginData = {
      username: "admin",
      password: "admin1234",
    };

    const res = await server.request.post("/auth/login").send(loginData);

    if (res.status === 200) {
      const token = res.body.token;
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      expect(decoded.username).toBe("admin");
      expect(decoded.userId).toBe(userId);
    }
  });

  test("POST /auth/login -> returns 400 for missing username", async () => {
    const loginData = {
      password: "admin1234",
    };

    const res = await server.request.post("/auth/login").send(loginData);

    expect(res.status).toBe(400);
  });

  test("POST /auth/login -> returns 400 for missing password", async () => {
    const loginData = {
      username: "admin",
    };

    const res = await server.request.post("/auth/login").send(loginData);

    expect(res.status).toBe(400);
  });

  test("POST /auth/login -> returns 401 for invalid username", async () => {
    const loginData = {
      username: "invalid",
      password: "admin1234",
    };
    const res = await server.request.post("/auth/login").send(loginData);

    expect(res.status).toBe(401);
  });

  test("POST /auth/login -> returns 401 for invalid username", async () => {
    const loginData = {
      username: "admin",
      password: "admin1245",
    };
    const res = await server.request.post("/auth/login").send(loginData);

    expect(res.status).toBe(401);
  });
});
