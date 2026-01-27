import { TestServer } from "./testSetup";
import userRoutes from "../routes/user.routes";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { describe } from "node:test";
import mongoose from "mongoose";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const server = new TestServer();
server.app.use("/users", userRoutes);

let token: string;
let adminToken: string;
let userId: string;
let adminUserId: string;
let testUserData: any;

beforeAll(async () => {
  await server.start();

  const hash = await bcrypt.hash("user1234", 10);

  const regularUser = await User.create({
    username: "user",
    password: hash,
    firstname: "testUser",
    lastname: "testUser",
    email: "testUser@email.com",
  });

  userId = regularUser._id.toString();
  testUserData = regularUser.toObject();

  const payload = {
    id: userId,
    username: regularUser.username,
    firstname: regularUser.firstname,
    lastname: regularUser.lastname,
    email: regularUser.email,
  };
  token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  const hashedAdmin = await bcrypt.hash("admin1234", 10);

  const adminUser = await User.create({
    username: "admin",
    password: hashedAdmin,
    firstname: "testAdmin",
    lastname: "testAdmin",
    email: "adminUser@email.com",
    roles: [
      {
        role: "ADMIN",
        active: true,
      },
    ],
  });

  adminUserId = adminUser._id.toString();

  const adminPayload = {
    id: adminUserId,
    username: adminUser.username,
    email: adminUser.email,
    roles: adminUser.roles,
  };
  adminToken = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await server.stop();
});

describe("User API – GET requests (non-admin access)", () => {
   test("GET /users -> returns a list of users", async () => {
    const res = await server.request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /users/{id} -> returns the authenticated user by id", async () => {
    const res = await server.request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id.toString()).toBe(userId);
  });

  test("GET /users/{id} -> fails with 400 when user id format is invalid", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .get(`/users/${nonValidId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test("GET /users/{id} -> fails with 401 when token is invalid", async () => {
    const res = await server.request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("GET /users/{id} -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  test("GET /users/{id} -> fails with 404 when user does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const res = await server.request
      .get(`/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("User API – POST requests (non-admin access)", () => {
  test("POST /users -> creates a new user successfully", async () => {
    const res = await server.request
      .post("/users")
      .send({
        username: "newuser",
        password: "123456",
        email: "newuser@email.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe("newuser");
  });

  test("POST /users -> fails with 400 when password format is invalid", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "newuser",
        password: "12",
        email: "newuser@email.com",
      });

    expect(res.status).toBe(400);
  });

  test("POST /users -> fails with 400 when username format is invalid", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "ne", password: "123456", email: "newuser@email.com" });

    expect(res.status).toBe(400);
  });

  test("POST /users -> fails with 400 when email is missing", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "newuser", password: "123456" });

    expect(res.status).toBe(400);
  });

  test("POST /users -> fails with 409 when user already exists", async () => {
    await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "newuser", password: "12456" });

    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "newuser",
        password: "12456",
        email: "newuser@email.com",
      });

    expect(res.status).toBe(409);
  });
});

describe("User API – PUT requests (non-admin access)", () => {
  test("PUT /users/{id} -> updates user data successfully", async () => {
    const updatedData = {
      firstname: "updatedName",
      email: "updated@email.com",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);
  });

  test("PUT /users/{id} -> fails with 401 when no token is provided", async () => {
    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request.put(`/users/${userId}`).send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users/{id} -> fails with 401 when token is invalid", async () => {
    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer not a valid token`)
      .send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users/{id} -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer not a valid token`)
      .send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users -> fails with 400 when password format is invalid", async () => {
    const wrongPass = {
      password: "12",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(wrongPass);

    expect(res.status).toBe(400);
  });

  test("PUT /users -> fails with 400 when username format is invalid", async () => {
    const wrongUsername = {
      username: "nw",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(wrongUsername);

    expect(res.status).toBe(400);
  });

  test("PUT /users/{id} -> fails with 400 when user id format is invalid", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .get(`/users/${nonValidId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test("PUT /users/{id} -> fails with 400 when user id is not valid", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .get(`/users/${nonValidId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe("User API – GET requests (admin access)", () => {
  test("GET /users -> fails with 401 when token is invalid", async () => {
    const res = await server.request
      .get("/users")
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("GET /users -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .get("/users")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  test("GET /users -> fails with 403 when user is not an admin", async () => {
    const res = await server.request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("User API – DELETE requests (admin access)", async () => {
  test("DELETE /users/{id} -> deletes a user successfully when requested by an admin", async () => {
    const res = await server.request
      .delete(`/users/${adminUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  test("DELETE /users/{id} -> fails with 400 when user id format is invalid", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .delete(`/users/${nonValidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });

  test("DELETE /users/{id} -> fails with 401 when token is invalid", async () => {
    const res = await server.request
      .delete(`/users/${adminUserId}`)
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("DELETE /users/{id} -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .delete(`/users/${adminUserId}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  test("DELETE /users/{id} -> fails with 403 when user is not an admin", async () => {
    const res = await server.request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test("DELETE /users/{id} -> fails with 404 when user does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const res = await server.request
      .delete(`/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
