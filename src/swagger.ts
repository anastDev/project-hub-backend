import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import mongooseToSwagger from "mongoose-to-swagger";
import { Express } from "express";
import Role from "./models/role.model";
import User from "./models/user.model";
import { zodComponents } from "./validators/zod-to-swagger/zod.registry";

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
        description: "Production server"
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
