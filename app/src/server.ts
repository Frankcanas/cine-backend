// app/src/server.ts

/**
 * Se encarga únicamente de configurar la aplicación Express: middlewares, rutas, swagger, etc.
 * No arranca el servidor ni toca la base de datos.
 * Esto hace que la aplicación sea testeable fácilmente, porque podemos importar app en nuestros tests sin necesidad de levantar el servidor real ni conectarse a la BD.
*/

import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

import userRoutes from "./routes/user.routes";
import membershipRoutes from "./routes/membership.routes";

import authRoutes from "./routes/auth.routes";

import emailRoutes from './routes/email.routes'; 

const app = express();

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mail', emailRoutes); 
app.use("/api/membership", membershipRoutes);
<<<<<<< Updated upstream
// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
=======
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);

// Swagger en formato JSON
app.get("/api/docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// Swagger visual
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
>>>>>>> Stashed changes

export default app;