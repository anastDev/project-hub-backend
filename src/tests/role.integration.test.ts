import { TestServer } from "./testSetup";
import roleRoutes from "../routes/role.routes";
import User from "../models/user.model";
import Role from "../models/role.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { describe } from "node:test";
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

describe("Role API Tests GET Requests (admin only)", () => {
  test("GET /roles -> returns a list of users (Admin only restriction)", async () => {
    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /users -> invalid token", async () => {
    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("GET /users -> expired token", async () => {
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

  test("GET /users -> user isn't an admin", async () => {
    const res = await server.request
      .get("/roles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("Role API Tests POST Requests (admin only)", () => {
  test("POST /users -> creates a new role", async () => {
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

  test("POST /users -> creates a new role with less than 4 characters", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "EXA",
      });

    expect(res.status).toBe(400);
  });

  test("POST /users -> invalid token", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer not a valid token`);

    expect(res.status).toBe(401);
  });

  test("POST /users -> expired token", async () => {
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

  test("POST /users -> user isn't an admin", async () => {
    const res = await server.request
      .post("/roles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test("POST /roles -> creates a new role", async () => {
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

describe("Role API Tests PUT Requests (admin only)", () => {
  test("PUT /roles/{id} -> successfully updates a role by ID", async () => {
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

  test("PUT /roles/{id} -> successfully updates a role by ID partially", async () => {
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

  test("PUT /roles/{id} -> creates a new role with wrong role format", async () => {
    const wrongRoleFormat = {
      role: "Ex",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(wrongRoleFormat);

    expect(res.status).toBe(400);
  });

  test("PUT /roles/{id} -> doesn't have a valid role objectId", async () => {
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

  test("PUT /users/{id} -> unsuccessful update without token", async () => {
    const updatedData = {
      role: "WRITER",
      description: "Writer",
    };

    const res = await server.request.put(`/roles/${roleId}`).send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users/{id} -> unsuccessful update with invalid token", async () => {
    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer not a valid token`)
      .send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /roles/{id} -> unsuccessful update with expired token", async () => {
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

  test("PUT /roles/{id} -> user isn't an admin", async () => {
    const updatedData = {
      role: "WRITER",
    };

    const res = await server.request
      .put(`/roles/${roleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(403);
  });
});
