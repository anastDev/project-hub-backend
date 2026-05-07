import { TestServer } from "./testSetup";
import movieRoutes from "../routes/movie.routes";
import dotenv from "dotenv";
import { describe } from "node:test";
dotenv.config();

const server = new TestServer();
server.app.use("/movies", movieRoutes);

let movieTitle: string;

beforeAll(async () => {
  await server.start();
  movieTitle = "Inside Out";
});

afterAll(async () => {
  await server.stop();
});

describe("Movie API - GET requests", () => {
  test("GET /movies -> returns a movie when a valid title is provided", async () => {
    const res = await server.request
      .get("/movies")
      .query({ title: movieTitle });

    expect(res.status).toBe(200);
    expect(res.body.Title).toBe("Inside Out");
  });

  test("GET /movies -> returns 400 when title is not provided", async () => {
    const res = await server.request.get("/movies");

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("TITLE_REQUIRED");
  });

  test("GET /movies -> returns 404 when movie is not found", async () => {
    const res = await server.request
      .get("/movies")
      .query({ title: "wjfbwefbwieuf" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie with title wjfbwefbwieuf not found");
    expect(res.body.code).toBe("MOVIE_NOT_FOUND");
  });
});
