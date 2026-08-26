import { Router } from "express";
import {
  getSeatsByShowtimeId,
  lockSeats,
  releaseSeats,
  getReservationsSummary,
} from "../controllers/seat.controller";

const router = Router();

/**
 * @swagger
 * /api/showtimes/{showtimeId}/seats:
 *   get:
 *     summary: Obtener la matriz de asientos de una función con su estado actual (AVAILABLE, OCCUPIED, LOCKED)
 *     tags: [Seats & Reservations]
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de asientos con su estado
 *       404:
 *         description: Función no encontrada
 */
router.get("/:showtimeId/seats", getSeatsByShowtimeId);

/**
 * @swagger
 * /api/reservations/lock-seats:
 *   post:
 *     summary: Bloquear temporalmente sillas para una función (10 minutos de expiración)
 *     tags: [Seats & Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seatIds
 *               - userId
 *             properties:
 *               showtimeId:
 *                 type: integer
 *                 example: 1
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               userId:
 *                 type: integer
 *                 example: 1
 *               durationMinutes:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Sillas bloqueadas exitosamente
 *       409:
 *         description: Sillas ya ocupadas o bloqueadas por otro usuario
 */
router.post("/lock-seats", lockSeats);

/**
 * @swagger
 * /api/reservations/release-seats:
 *   delete:
 *     summary: Liberar sillas previamente bloqueadas por el usuario
 *     tags: [Seats & Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seatIds
 *               - userId
 *             properties:
 *               showtimeId:
 *                 type: integer
 *                 example: 1
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Sillas liberadas correctamente
 */
router.delete("/release-seats", releaseSeats);

/**
 * @swagger
 * /api/reservations/summary:
 *   get:
 *     summary: Obtener resumen de reservas y sillas bloqueadas por el usuario
 *     tags: [Seats & Reservations]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de bloqueos activos del usuario
 */
router.get("/summary", getReservationsSummary);

export default router;