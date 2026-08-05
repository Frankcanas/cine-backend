// /app/src/config/database.ts

/**
 * Configuración de Sequelize para PostgreSQL
 * ------------------------------------------
 * Este módulo inicializa y exporta una instancia de Sequelize, 
 * configurada con las variables de entorno definidas en `.env` o en `docker-compose`.
 */

import { Sequelize } from "sequelize-typescript";
import Membership from "../models/membreship.model";
import Movie from "../models/movie.model";
import Cinema from "../models/cinema.model";
import Room from "../models/room.model";
import Showtime from "../models/showtime.model";
import Genre from "../models/genre.model";
import MovieGenre from "../models/movie-genre.model";

/**
 * Instancia de Sequelize configurada para PostgreSQL.
 * Se conecta utilizando las credenciales y parámetros definidos en las variables de entorno.
 */
const sequelize = new Sequelize(
  process.env.POSTGRES_DB as string,
  process.env.POSTGRES_USER as string,
  process.env.POSTGRES_PASSWORD as string,
  {
    host: process.env.POSTGRES_HOST || "db", // En docker-compose, el servicio de la BD se llama "db"
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    dialect: "postgres",
    logging: false, // Desactiva logs SQL en consola (útil en producción)
    models: [Membership, Movie, Cinema, Room, Showtime, Genre, MovieGenre],
  }
);

export default sequelize;