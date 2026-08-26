// app/src/server.ts

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

import helmet from "helmet";

import userRoutes from "./routes/user.routes";
import membershipRoutes from "./routes/membership.routes";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import showtimeRoutes from "./routes/showtime.routes";
import movieReleaseRoutes from "./routes/movie-release.routes";
import upcomingNotificationRoutes from "./routes/upcoming-notification.routes";
import tokenRoutes from "./routes/token.routes";
import emailRoutes from "./routes/email.routes";
import locationRoutes from "./routes/location.routes";
import marketingEmailRoutes from "./routes/marketing-email.routes";
import healthRoutes from "./routes/health.routes"
import seatRoutes from "./routes/seat.routes"
const app = express();

// Seguridad de Cabeceras HTTP (HU-001)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Habilitar CORS para permitir peticiones desde cualquier origen (Swagger UI, Frontend, etc.)
app.use(cors());

app.use(express.json());

// Health Check (HU-001)
app.use("/api/v1", healthRoutes);

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", tokenRoutes);
app.use("/api/mail", emailRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/showtimes", seatRoutes);
app.use("/api/reservations", seatRoutes);
app.use("/api/releases", movieReleaseRoutes);
app.use("/api/notifications", upcomingNotificationRoutes);
// FCB - Modificado: Se montaron las rutas de ubicaciones (HU-002)
app.use("/api/locations", locationRoutes);
app.use("/api/marketing", marketingEmailRoutes);

// Swagger JSON endpoint
app.get("/api/docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;