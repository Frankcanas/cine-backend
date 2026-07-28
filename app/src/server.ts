// app/src/server.ts

/**
 * Se encarga únicamente de configurar la aplicación Express: middlewares, rutas, swagger, etc.
 * No arranca el servidor ni toca la base de datos.
 * Esto hace que la aplicación sea testeable fácilmente, porque podemos importar app en nuestros tests sin necesidad de levantar el servidor real ni conectarse a la BD.
*/

import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(express.json());

// Rutas

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;