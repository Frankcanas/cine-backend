// app/src/docs/swagger.ts

import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Riwi Cine API",
      version: "1.0.0",
      description: "API de gestión del sistema Multicine.",
    },
    servers: [
      {
        url: "/",
        description: "Servidor actual (relativo)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor local (localhost:3000)",
      },
      {
        url: "http://127.0.0.1:3000",
        description: "Servidor IP local (127.0.0.1:3000)",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../routes/*.ts").replace(/\\/g, "/"),
    path.join(__dirname, "../routes/*.js").replace(/\\/g, "/"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);