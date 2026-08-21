// app/src/routes/showtime.routes.ts
import { Router } from "express";
import {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getShowtimesByMovieId,
} from "../controllers/showtime.controller";

const router = Router();

/**
 * @swagger
 * /api/showtimes:
 *   get:
 *     summary: Obtener todas las funciones (showtimes) de cine
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de película
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de sala
 *     responses:
 *       200:
 *         description: Lista de funciones encontradas
 */
router.get("/", getShowtimes);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   get:
 *     summary: Obtener una función de cine por ID
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la función
 *       404:
 *         description: Función no encontrada
 */
router.get("/:id", getShowtimeById);

/**
 * @swagger
 * /api/showtimes:
 *   post:
 *     summary: Crear una nueva función de cine
 *     tags: [Showtimes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - roomId
 *               - startTime
 *               - endTime
 *               - price
 *             properties:
 *               movieId:
 *                 type: integer
 *               roomId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Función creada exitosamente
 */
router.post("/", createShowtime);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   put:
 *     summary: Actualizar una función de cine
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Función actualizada exitosamente
 */
router.put("/:id", updateShowtime);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   delete:
 *     summary: Eliminar una función de cine
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Función eliminada exitosamente
 */
router.delete("/:id", deleteShowtime);


/**
 * @swagger
 * /api/movies/{movieId}/showtimes:
 *   get:
 *     summary: Obtener funciones disponibles para una película, con filtros de formato e idioma
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de funciones con sala y asientos disponibles
 *       400:
 *         description: movieId inválido
 */
router.get("/:movieId/showtimes", getShowtimesByMovieId);

export default router;
