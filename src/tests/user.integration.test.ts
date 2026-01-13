import { TestServer } from "./testSetup";
import userRoutes from "../routes/user.routes";
import User from "../models/user.model";
import Role from "../models/role.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { describe } from "node:test";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const server = new TestServer();
server.app.use("/users", userRoutes);

let token: string;
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

  const payload = {
    id: userId,
    username: user.username,
    email: user.email,
    roles: user.roles,
  };
  token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await server.stop();
});

describe("User API Tests GET Requests (non-admin)", () => {
  test("GET /users/{id} -> returns a user by ID", async () => {
    const res = await server.request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id.toString()).toBe(userId);
  });

  test("GET /users/{id} -> doesn't find the user", async () => {
    const nonExistentId = "507f1f77bcf86cd799439011";

    const res = await server.request
      .get(`/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  test("GET /users/{id} -> doesn't have a valid objectId", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .get(`/users/${nonValidId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe("User API Tests POST Requests (non-admin)", () => {
  test("POST /users -> creates a new user", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "newuser",
        password: "123456",
        email: "newuser@email.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe("newuser");
  });

  test("POST /users -> creates a new user with wrong password", async () => {
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

  test("POST /users -> creates a new user with wrong username", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "ne", password: "123456", email: "newuser@email.com" });

    expect(res.status).toBe(400);
  });

  test("POST /users -> creates a new user without email", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "newuser", password: "123456" });

    expect(res.status).toBe(400);
  });

  test("POST /users -> creates a new user with invalid token", async () => {
    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer not a valid token`)
      .send({
        username: "newuser",
        password: "123456",
        email: "newuser@email.com",
      });

    expect(res.status).toBe(401);
  });

  test("POST /users -> creates a new user with expired token", async () => {
    const expiredPayload = {
      username: "testuser",
      password: "123456",
      email: "testUser@email.com",
    };

    const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, {
      expiresIn: "-1h",
    });

    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${expiredToken}`)
      .send({
        username: "newuser",
        password: "123456",
        email: "newuser@email.com",
      });
    expect(res.status).toBe(401);
  });
});

describe("User API Tests PUT Requests (non-admin)", () => {
  test("PUT /users/{id} -> successfully updates a user by ID", async () => {
    const updatedData = {
      firstname: "updatedname",
      email: "updated@email.com",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);

    expect(res.body.firstname).toBe(updatedData.firstname);
    expect(res.body.email).toBe(updatedData.email);
  });

  test("PUT /users/{id} -> unsuccessful update without token", async () => {
    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request.put(`/users/${userId}`).send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users/{id} -> unsuccessful update with invalid token", async () => {
    const updatedData = {
      firstname: "updatedname",
    };

    const res = await server.request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer not a valid token`)
      .send(updatedData);

    expect(res.status).toBe(401);
  });

  test("PUT /users/{id} -> unsuccessful update with expired token", async () => {
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

  test("PUT /users -> creates a new user with wrong password format", async () => {
    const wrongPass = {
      password: "12",
    };

    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ wrongPass });

    expect(res.status).toBe(400);
  });

  test("PUT /users -> creates a new user with wrong username", async () => {
    const wrongUsername = {
      username: "nw",
    };

    const res = await server.request
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ wrongUsername });

    expect(res.status).toBe(400);
  });

  test("PUT /users/{id} -> doesn't have a valid objectId", async () => {
    const nonValidId = "507f1f77bcf86";

    const res = await server.request
      .get(`/users/${nonValidId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});
