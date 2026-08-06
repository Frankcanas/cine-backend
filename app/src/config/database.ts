// app/src/config/database.ts

/**
 * Configuración de Sequelize para PostgreSQL
 * ------------------------------------------
 * Inicializa y exporta la instancia de Sequelize registrando todos los modelos.
 */

import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

dotenv.config();
import Membership from "../models/membreship.model";
import User from "../models/user.model";
import Movie from "../models/movie.model";
import Cinema from "../models/cinema.model";
import Room from "../models/room.model";
import Showtime from "../models/showtime.model";
import Genre from "../models/genre.model";
import MovieGenre from "../models/movie-genre.model";
import MovieRelease from "../models/movie-release.model";
import UpcomingNotification from "../models/upcoming-notification.model";

const sequelize = new Sequelize(
  process.env.POSTGRES_DB as string,
  process.env.POSTGRES_USER as string,
  process.env.POSTGRES_PASSWORD as string,
  {
    host: process.env.POSTGRES_HOST || "db",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    dialect: "postgres",
    logging: false,
    models: [
      Membership,
      User,
      Movie,
      Cinema,
      Room,
      Showtime,
      Genre,
      MovieGenre,
      MovieRelease,
      UpcomingNotification,
    ],
  }
);

export default sequelize;