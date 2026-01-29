# Project Hub Backend 🚀 

A backend REST API designed to support the project *[React Projects Hub](https://github.com/anastDev/react-projects-hub)*.  
It provides **JWT authentication**, **role-based access control**, **schema validation** and **Swagger/OpenAPI documentation**.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## 📑 Table of Contents

- [Features](#-features)
- [Setup](#️-setup)
- [Swagger & Zod Integration](#-swagger--zod-integration)
- [Testing](#-testing)
- [Author](#-author)
- [License](#-license)

## ✨ Features

- JWT-based authentication 🔐
- Role & user management 👤
- Strong request validation using Zod ✅
- Manually written Swagger documentation ✍️
- Reuse of Zod schemas inside OpenAPI components ♻️
- In-memory MongoDB for isolated tests 🧪
- Request logging with Morgan 🪵


## ⚙️ Setup 

### Prerequisites

- Node.js: >= **25.0.3**
- npm >= **11.6.2**
- MongoDB (or in-memory MongoDB for testing)

### Setup Steps

1.  Navigate to the root directory
2. Create a `.env` file **at the root of the server project (outside the `src` folder)**
3. Install dependencies:
  ```bash
    npm install
  ```
4. Start development server:
  ```bash
    npm run dev
  ```
5. Start development server:
  ```bash
    npm start
  ```

## 📘 Swagger & Zod Integration

The API documentation is **manually written using Swagger**, while **Zod schemas are reused inside OpenAPI components** to avoid duplication and keep validation and documentation aligned.

This is achieved using the package: **@asteasolutions/zod-to-openapi**

**Benefits**:
- *Single source of truth for schemas 🧠*
- *Reduced duplication ♻️*
- *Consistent validation & API contracts 🔒*

code:

```ts
const registry = new OpenAPIRegistry();

export const CreateUserApi = registry.register("CreateUser", createUserSchema);
export const UpdateUserApi = registry.register("UpdateUser", updateUserSchema);
export const CreateRoleApi = registry.register("CreateRole", createRoleSchema);
export const UpdateRoleApi = registry.register("UpdateRole", updateRoleSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
export const zodComponents = generator.generateComponents();
```

> Swagger UI is available at: [here](http://localhost:3000/api/docs)

## 🧪 Testing

- **Jest** as the test runner
- **mongodb-memory-server** for fast, isolated database testing

Run tests with:
  ```bash
    npm run test
  ```


## 👤 Author

[anastDev](#project-hub-backend-)

## 📄 License

This project is licensed under the MIT License.