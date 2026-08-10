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

import { Sequelize } from "sequelize-typescript";

import ApiClient from "../models/api-client.model";
import Audit from "../models/audit.model";
import Cart from "../models/cart.model";
import CartSnack from "../models/cart-snack.model";
import CartTicket from "../models/cart-ticket.model";
import ChatHistory from "../models/chat-history.model";
import Cinema from "../models/cinema.model";
import City from "../models/city.model";
import ConcessionDetail from "../models/concession-detail.model";
import Coupon from "../models/coupon.model";
import Country from "../models/country.model";
import Department from "../models/department.model";
import FlashCinema from "../models/flash-cinema.model";
import Format from "../models/format.model";
import Genre from "../models/genre.model";
import Invoice from "../models/invoice.model";
import Language from "../models/language.model";
import Membership from "../models/membership.model";
import Movie from "../models/movie.model";
import MovieGenre from "../models/movie-genre.model";
import MovieRelease from "../models/movie-release.model";
import Notification from "../models/notification.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";
import Point from "../models/point.model";
import PremiereRequest from "../models/premiere-request.model";
import Promotion from "../models/promotion.model";
import Pqrs from "../models/pqrs.model";
import Recommendation from "../models/recommendation.model";
import RefreshToken from "../models/refresh-token.model";
import Rol from "../models/role.model";
import Room from "../models/room.model";
import Seat from "../models/seat.model";
import SeatLock from "../models/seat-lock.model";
import Showtime from "../models/showtime.model";
import ShowtimeChange from "../models/showtime-change.model";
import Snack from "../models/snack.model";
import SnackCategory from "../models/snack-category.model";
import Survey from "../models/survey.model";
import Ticket from "../models/ticket.model";
import Transfer from "../models/transfer.model";
import UpcomingNotification from "../models/upcoming-notification.model";
import User from "../models/user.model";
import Voucher from "../models/voucher.model";

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
      ApiClient,
      Audit,
      Cart,
      CartSnack,
      CartTicket,
      ChatHistory,
      Cinema,
      City,
      ConcessionDetail,
      Coupon,
      Country,
      Department,
      FlashCinema,
      Format,
      Genre,
      Invoice,
      Language,
      Membership,
      Movie,
      MovieGenre,
      MovieRelease,
      Notification,
      Order,
      Payment,
      Point,
      PremiereRequest,
      Promotion,
      Pqrs,
      Recommendation,
      RefreshToken,
      Rol,
      Room,
      Seat,
      SeatLock,
      Showtime,
      ShowtimeChange,
      Snack,
      SnackCategory,
      Survey,
      Ticket,
      Transfer,
      UpcomingNotification,
      User,
      Voucher,
    ],
});

export default sequelize;