// app/src/server.ts

import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

import userRoutes from "./routes/user.routes";
import membershipRoutes from "./routes/membership.routes";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import showtimeRoutes from "./routes/showtime.routes";
import movieReleaseRoutes from "./routes/movie-release.routes";
import upcomingNotificationRoutes from "./routes/upcoming-notification.routes";

const app = express();

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/releases", movieReleaseRoutes);
app.use("/api/notifications", upcomingNotificationRoutes);


//Swagger json format 

app.get("/api/docs.json",(_req, res) =>{
    res.status(200).json(swaggerSpec);
}
)
// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;