import { TestServer } from "./testSetup";
import roleRoutes from "../routes/role.routes";
import User from "../models/user.model";
import Role from "../models/role.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { describe } from "node:test";
import mongoose from "mongoose";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const server = new TestServer();
server.app.use("/roles", roleRoutes);

let token: string;
let roleId: string;
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

  const role = await Role.create({
    role: "EDITOR",
    description: "Editor role",
    active: true,
  });

  roleId = role._id.toString();
});

afterAll(async () => {
  await server.stop();
});

describe("Role API – GET requests (admin access)", () => {
  test("GET /roles -> returns a list of roles when requested by an admin", async () => {
    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /roles -> fails with 401 when token is invalid", async () => {
    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("GET /roles -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  test("GET /roles -> fails with 403 when user is not an admin", async () => {
    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("Role API – POST requests (admin access)", () => {
  test("POST /users -> creates a new role when requested by an admin", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "WRITER",
        description: "Writer role",
        active: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe("WRITER");
  });

  test("POST /users -> fails with 400 when role name is shorter than minimum length", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "EXA",
      });

    expect(res.status).toBe(400);
  });

  test("POST /users -> fails with 401 when token is invalid", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("POST /users -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  test("POST /users -> fails with 403 when user is not an admin", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test("POST /roles -> fails with 409 when role already exists", async () => {
    await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "WRITER",
        description: "Writer role",
        active: true,
      });

    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "WRITER",
        description: "Writer role",
        active: true,
      });

    expect(res.status).toBe(409);
  });
});

describe("Role API – PUT requests (admin access)", () => {
  test("PUT /roles/{id} -> updates a role successfully when requested by an admin", async () => {
    const updatedData = {
      role: "NEW_ROLE",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("NEW_ROLE");
  });

  test("PUT /roles/{id} -> updates a role partially when valid data is provided", async () => {
    const updatedData = {
      description: "Writer role",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.role).toBeDefined();
  });

  test("PUT /roles/{id} -> fails with 400 when role format is invalid", async () => {
    const wrongRoleFormat = {
      role: "Ex",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(wrongRoleFormat);

    expect(res.status).toBe(400);
  });

  test("PUT /roles/{id} -> fails with 400 when role id format is invalid", async () => {
    const nonValidId = "507f1f77bcf86";
    const updatedData = {
      description: "Writer role",
    };

    const res = await server.request
      .put(`/roles/${nonValidId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(400);
  });

  test("PUT /users/{id} -> fails with 401 when no token is provided", async () => {
    const updatedData = {
      role: "WRITER",
      description: "Writer",
    };

    const res = await server.request.put(`/roles/${roleId}`).send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users/{id} -> fails with 401 when token is invalid", async () => {
    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer not a valid token`)
      .send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /roles/{id} -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const updatedData = {
      role: "Example",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer not a valid token`)
      .send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /roles/{id} -> fails with 403 when user is not an admin", async () => {
    const updatedData = {
      role: "WRITER",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(403);
  });

  test("PUT /roles/{id} -> fails with 404 when role does not exist", async () => {
    const invalidId = new mongoose.Types.ObjectId().toString();
    const updatedData = {
      role: "Example_Role",
    };

    const res = await server.request
      .put(`/roles/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);
    expect(res.status).toBe(404);
  });
});

describe("Role API – DELETE requests (admin access)", () => {
  test("DELETE /roles/{id} -> deletes a role successfully when requested by an admin", async () => {
    const res = await server.request
      .delete(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  test("DELETE /roles/{id} -> fails with 400 when role id format is invalid", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .delete(`/roles/${nonValidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });

  test("DELETE /roles/{id} -> fails with 401 when token is invalid", async () => {
    const res = await server.request
      .delete(`/roles/${roleId}`)
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("DELETE /roles/{id} -> fails with 401 when token is expired", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .delete(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  test("DELETE /roles/{id} -> fails with 403 when user is not an admin", async () => {
    const res = await server.request
      .delete(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test("DELETE /roles/{id} -> fails with 404 when role does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const res = await server.request
      .delete(`/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
