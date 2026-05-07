jest.mock("../utils/geoFilter", () => ({
  filterByUserLocation: jest.fn((conditions) => conditions),
  filterDeviationsByLocation: jest.fn((deviations) => deviations),
}));

jest.mock("../services/conditions.service", () => ({
  getRoadConditions: jest.fn().mockResolvedValue([
    {
      RoadNumber: "E 6",
      LocationText: "E 6 Gothenburg",
      ConditionText: "Normalt",
      ConditionInfo: ["Torrt"],
      Geometry: { WGS84: "LINESTRING (11.97 57.70, 11.98 57.71)" },
      StartTime: "2026-05-04T00:00:00.000+02:00",
    },
  ]),
  getAccidents: jest.fn().mockResolvedValue([]),
}));

import { TestServer } from "./testSetup";
import conditionRoutes from "../routes/condition.routes";
import dotenv from "dotenv";
import { describe } from "node:test";
dotenv.config();

const server = new TestServer();
server.app.use("/condition", conditionRoutes);

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("Condition API - POST requests", () => {
  test("POST /condition/:county -> returns 200 when a valid county snd valid latitude and longitude are provided", async () => {
    const res = await server.request
      .post("/condition/Gothenburg")
      .send({ lat: 57.7089, long: 11.9746 });

    expect(res.status).toBe(200);
  });

  test("POST /condition/:county -> returns 400 when lat or long is invalid", async () => {
    const res = await server.request
      .post("/condition/Gothenburg")
      .send({ lat: "invalid", long: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Lat and long must be valid numbers");
    expect(res.body.code).toBe("INVALID_PARAMETERS");
  });

  test("POST /condition/:county -> returns 404 when county is not found", async () => {
    const res = await server.request
      .post("/condition/UnknownCity")
      .send({ lat: 57.7089, long: 11.9746 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Unknown city: UnknownCity");
    expect(res.body.code).toBe("UNKNOWN_CITY");
  });

  test("POST /condition/accidents/:county -> returns 200 when a valid county and valid coordinates are provided", async () => {
    const res = await server.request
      .post("/condition/accidents/Gothenburg")
      .send({ lat: 57.7089, long: 11.9746 });

    expect(res.status).toBe(200);
  });

  test("POST /condition/accidents/:county -> returns 400 when lat or long is invalid", async () => {
    const res = await server.request
      .post("/condition/accidents/Gothenburg")
      .send({ lat: "invalid", long: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Lat and long must be valid numbers");
    expect(res.body.code).toBe("INVALID_PARAMETERS");
  });

  test("POST /condition/accidents/:county -> returns 404 when county is not found", async () => {
    const res = await server.request
      .post("/condition/accidents/UnknownCity")
      .send({ lat: 57.7089, long: 11.9746 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Unknown city: UnknownCity");
    expect(res.body.code).toBe("UNKNOWN_CITY");
  });
});
