// /app/src/config/database.ts

/**
 * Configuración de Sequelize para PostgreSQL
 * ------------------------------------------
 * Este módulo inicializa y exporta una instancia de Sequelize, 
 * se configurada con las variables de entorno definidas en `.env` o en `docker-compose`.
 *
 * Uso principal:
 *  - Establecer la conexión con la base de datos PostgreSQL.
 *  - Ser importado por los modelos y utilidades que requieran interactuar con Sequelize.
 *
 * Variables de entorno utilizadas:
 *  - POSTGRES_DB: Nombre de la base de datos.
 *  - POSTGRES_USER: Usuario de conexión a la base de datos.
 *  - POSTGRES_PASSWORD: Contraseña del usuario de la base de datos.
 *  - POSTGRES_HOST: Host de la base de datos (por defecto `db` para docker-compose).
 *  - POSTGRES_PORT: Puerto de conexión (por defecto `5432`).
 */

//import { Sequelize } from "sequelize";

import { Sequelize } from "sequelize-typescript";
import User from "../models/user.model";
import Membership from "../models/membreship.model";
import Movie from "../models/movie.model";
import Cinema from "../models/cinema.model";
import Room from "../models/room.model";
import Showtime from "../models/showtime.model";
import Genre from "../models/genre.model";
import MovieGenre from "../models/movie-genre.model";
import MovieRelease from "../models/movie-release.model";
import UpcomingNotification from "../models/upcoming-notification.model";
import Department from "../models/department.model";
import City from "../models/city.model";
import Country from "../models/country.model";
import ApiClient from "../models/api-client.model";
import Audit from "../models/audit.model";
import Rol from "../models/role.model";
import ChatHistory from "../models/chat-history.model";
import Pqrs from "../models/pqrs.model";
import Notification from "../models/notification.model";
import Voucher from "../models/voucher.model";
import { AnyARecord } from "node:dns";



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
    models: [
      User, 
      Membership, 
      Movie,
      Cinema,
      Room,
      Showtime,
      Genre,
      MovieGenre,
      MovieRelease,
      UpcomingNotification, 
      Department, 
      City, 
      Country, 
      ApiClient, 
      Audit, 
      Rol, 
      ChatHistory, 
      Pqrs, 
      Notification, 
      Voucher
    ],
});

export default sequelize;