import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import mongooseToSwagger from "mongoose-to-swagger";
import { Express } from "express";
import Role from "./models/role.model";
import User from "./models/user.model";
import WeatherApiResponse from "./models/weather.model";
import { zodComponents } from "./validators/zod-to-swagger/zod.registry";
import { exactOptional } from "zod";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Hub Backend API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Server",
      },
      {
        url: "https://anastdev.github.io/react-projects-hub/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: mongooseToSwagger(User),
        Role: mongooseToSwagger(Role),
        WeatherResponse: {
          type: "object",
          properties: {
            coord: {
              type: "object",
              properties: {
                lon: {
                  type: "number",
                  description: "Longitude of the location",
                },
                lat: {
                  type: "number",
                  description: "Latitude of the location",
                },
              },
              required: ["lon", "lat"],
            },
            weather: {
              type: "array",
              description: "Weather condition information",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", description: "Weather condition id" },
                  main: {
                    type: "string",
                    description:
                      "Group of weather parameters (Rain, Snow, Extreme etc.)",
                  },
                  description: {
                    type: "string",
                    description: "Weather condition within the group",
                  },
                  icon: { type: "string", description: "Weather icon id" },
                },
              },
            },
            main: {
              type: "object",
              properties: {
                temp: { type: "number", description: "Temperature in Celsius" },
                feels_like: {
                  type: "number",
                  description: "Temperature accounting for human perception",
                },
                temp_min: {
                  type: "number",
                  description: "Minimum temperature at the moment",
                },
                temp_max: {
                  type: "number",
                  description: "Maximum temperature at the moment",
                },
                pressure: {
                  type: "number",
                  description: "Atmospheric pressure in hPa",
                },
                humidity: {
                  type: "number",
                  description: "Humidity percentage",
                },
              },
              required: ["temp", "feels_like", "pressure", "humidity"],
            },
            visibility: {
              type: "number",
              description: "Visibility in meters, maximum value is 10km",
            },
            wind: {
              type: "object",
              properties: {
                speed: {
                  type: "number",
                  description: "Wind speed in meter/sec",
                },
                deg: {
                  type: "number",
                  description: "Wind direction in degrees",
                },
                gust: { type: "number", description: "Wind gust in meter/sec" },
              },
              required: ["speed", "deg"],
            },
            rain: {
              type: "object",
              description: "Rain volume for the last hour",
              properties: {
                "1h": {
                  type: "number",
                  description: "Rain volume for last hour in mm",
                },
              },
            },
            snow: {
              type: "object",
              description: "Snow volume for the last hour",
              properties: {
                "1h": {
                  type: "number",
                  description: "Snow volume for last hour in mm",
                },
              },
            },
            clouds: {
              type: "object",
              properties: {
                all: { type: "number", description: "Cloudiness percentage" },
              },
              required: ["all"],
            },
            sys: {
              type: "object",
              properties: {
                country: {
                  type: "string",
                  description: "Country code (GB, US, etc.)",
                },
                sunrise: {
                  type: "number",
                  description: "Sunrise time, Unix timestamp UTC",
                },
                sunset: {
                  type: "number",
                  description: "Sunset time, Unix timestamp UTC",
                },
              },
              required: ["country", "sunrise", "sunset"],
            },
            timezone: {
              type: "number",
              description: "Shift in seconds from UTC",
            },
            name: {
              type: "string",
              description: "City name",
            },
            cod: {
              type: "number",
              description: "Internal parameter, HTTP status code",
            },
          },
          example: {
            coord: { lon: -0.1257, lat: 51.5085 },
            weather: [
              {
                id: 300,
                main: "Drizzle",
                description: "light intensity drizzle",
                icon: "09d",
              },
            ],
            main: {
              temp: 15.3,
              feels_like: 14.8,
              temp_min: 13.9,
              temp_max: 16.7,
              pressure: 1012,
              humidity: 82,
            },
            visibility: 10000,
            wind: { speed: 4.1, deg: 230 },
            clouds: { all: 75 },
            sys: {
              country: "GB",
              sunrise: 1605686436,
              sunset: 1605720455,
            },
            timezone: 0,
            name: "London",
            cod: 200,
          },
        },
        ...zodComponents.components?.schemas,
        ResponseError: {
          type: "object",
          properties: {
            message: { type: "string" },
            code: { type: "string" },
          },
        },
        LoginResponse: {
          type: Object,
          properties: {
            username: { type: "string", required: true },
            password: { type: "string", required: true },
          },
        },
        MovieResponse: {
          type: "object",
          properties: {
            Title: { type: "string", description: "Movie title" },
            Year: { type: "string", description: "Release year" },
            Rated: {
              type: "string",
              description: "Movie rating (PG, PG-13, R, etc.)",
            },
            Released: { type: "string", description: "Release date" },
            Runtime: {
              type: "string",
              description: "Movie runtime (e.g., '95 min')",
            },
            Genre: {
              type: "string",
              description: "Movie genres (comma-separated)",
            },
            Director: { type: "string", description: "Director name(s)" },
            Writer: { type: "string", description: "Writer name(s)" },
            Actors: {
              type: "string",
              description: "Main actors (comma-separated)",
            },
            Plot: { type: "string", description: "Movie plot summary" },
            Language: {
              type: "string",
              description: "Languages (comma-separated)",
            },
            Country: { type: "string", description: "Country of origin" },
            Awards: { type: "string", description: "Awards and nominations" },
            Poster: {
              type: "string",
              description: "URL to movie poster image",
            },
            Source: { type: "string", description: "Rating source" },
            Value: { type: "string", description: "Rating value" },
            Metascore: { type: "string", description: "Metacritic score" },
            imdbRating: { type: "string", description: "IMDb rating" },
            imdbVotes: { type: "string", description: "Number of IMDb votes" },
            imdbID: {
              type: "string",
              description: "IMDb ID (e.g., 'tt2096673')",
            },
            Type: {
              type: "string",
              description: "Media type (movie, series, episode)",
            },
            DVD: { type: "string", description: "DVD release date" },
            BoxOffice: { type: "string", description: "Box office earnings" },
            Production: { type: "string", description: "Production company" },
            Website: { type: "string", description: "Official website" },
            Response: {
              type: "string",
              description: "Response status ('True' or 'False')",
            },
          },
          required: ["Title", "Year", "Genre", "imdbID", "Type"],
          example: {
            Title: "Inside Out",
            Year: "2015",
            Rated: "PG",
            Released: "19 Jun 2015",
            Runtime: "95 min",
            Genre: "Animation, Adventure, Comedy",
            Director: "Pete Docter, Ronnie Del Carmen",
            Writer: "Pete Docter, Ronnie Del Carmen, Meg LeFauve",
            Actors: "Amy Poehler, Bill Hader, Lewis Black",
            Plot: "After young Riley is uprooted from her Midwest life...",
            Language: "English, Portuguese, Latvian",
            Country: "United States",
            Awards: "Won 1 Oscar. 99 wins & 118 nominations total",
            Poster: "",
            Source: "Internet Movie Database",
            Value: "8.1/10",
            Metascore: "94",
            imdbRating: "8.1",
            imdbVotes: "905,131",
            imdbID: "tt2096673",
            Type: "movie",
            DVD: "N/A",
            BoxOffice: "$356,461,711",
            Production: "N/A",
            Website: "N/A",
            Response: "True",
          },
        },
      },
      responses: {
        BadRequestError: {
          description:
            "**400 Bad Request** - Request was malformed or contains invalid data.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              examples: {
                invalidFormat: {
                  summary: "Validation error",
                  value: {
                    message: "Invalid input format",
                    code: "VALIDATION_ERROR",
                  },
                },
                malformed: {
                  summary: "Malformed JSON",
                  value: {
                    message: "Invalid JSON format in request body",
                    code: "MALFORMED_JSON",
                  },
                },
                missingFields: {
                  summary: "Missing required fields",
                  value: {
                    message: "Missing required fields: email, password",
                    code: "MISSING_REQUIRED_FIELDS",
                  },
                },
              },
            },
          },
        },
        UnauthorizedError: {
          description:
            "**401 Unauthorized** - Authentication token is missing, invalid or expired.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              examples: {
                missingToken: {
                  summary: "Missing authentication token",
                  value: {
                    message: "Authentication token is required",
                    code: "UNAUTHORIZED",
                  },
                },
                invalidToken: {
                  summary: "Invalid or expired token",
                  value: {
                    message: "Invalid or expired authentication token",
                    code: "UNAUTHORIZED",
                  },
                },
                invalidCredentials: {
                  summary: "Invalid credentials",
                  value: {
                    message: "Invalid email or password",
                    code: "INVALID_CREDENTIALS",
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description:
            "**403 Forbidden** - Authenticated user does not have admin privileges.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                message: "Admin role required to access this resource",
                code: "FORBIDDEN",
              },
            },
          },
        },
        NotFound: {
          description: "404 Not Found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                userNotFound: {
                  summary: "User not found",
                  value: {
                    message: "User with ID `123` not found",
                    error: "USER_NOT_FOUND",
                    userId: "123",
                  },
                },
                roleNotFound: {
                  summary: "Role not found",
                  value: {
                    message: "Role with ID `123` not found",
                    error: "USER_NOT_FOUND",
                    userId: "123",
                  },
                },
              },
            },
          },
        },
        Conflict: {
          description:
            "409 Conflict - request wasn't completed because of a conflict with the resource's current state",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              examples: {
                userConflict: {
                  summary: "Request not completed cause of conflict",
                  value: {
                    message: "User already exists",
                    code: "CONFLICT",
                  },
                },
                roleConflict: {
                  summary: "Request not completed cause of conflict",
                  value: {
                    message: "Role already exists",
                    code: "CONFLICT",
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description:
            "**500 Internal Server Error** - An unexpected error occurred on the server.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR",
              },
            },
          },
        },
        DatabaseError: {
          description:
            "**503 Service Unavailable** - Database service is temporarily unavailable.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                message: "Database connection issue",
                code: "DATABASE_UNAVAILABLE",
              },
            },
          },
        },
        CityNotFound: {
          description: "City not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                message: "City by the name `London` not found",
                error: "CITY_NOT_FOUND",
                cityName: "London",
              },
            },
          },
        },
        MovieNotFound: {
          description: "Movie not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                message: "Movie with title `Inside out` not found",
                error: "MOVIE_NOT_FOUND",
              },
            },
          },
        },
        TitleRequired: {
          description: "Title parameter is missing",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResponseError",
              },
              example: {
                message: "Title parameter is required",
                code: "TITLE_REQUIRED",
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));
};
