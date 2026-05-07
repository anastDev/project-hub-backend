import { TestServer } from "./testSetup";
import weatherRoutes from "../routes/weather.routes";
import dotenv from "dotenv";
import { describe } from "node:test";
dotenv.config();

const server = new TestServer();
server.app.use("/weather", weatherRoutes);

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("Weather API - GET requests", () => {
  test("GET /weather/:city -> returns 200 when a valid city is provided", async () => {
    const res = await server.request.get("/weather/London");

    expect(res.status).toBe(200);
  });

  test("GET /weather/:city -> returns 400 when city name is invalid", async () => {
    const res = await server.request.get("/weather/757576567");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid city name");
    expect(res.body.code).toBe("INVALID_CITY_NAME");
  });

  test("GET /weather/:city -> returns 404 when city is not found", async () => {
    const res = await server.request.get("/weather/Londonn");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Weather for city with name Londonn not found");
    expect(res.body.code).toBe("CITY_NOT_FOUND");
  });
});
