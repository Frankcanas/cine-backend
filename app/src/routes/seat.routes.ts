import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { lockSeats, releaseSeats, releaseSingleSeatLock, getReservationsSummary } from "../controllers/seat.controller";

const router = Router();

/**
 * @swagger
 * /api/reservations/lock-seats:
 *   post:
 *     summary: Bloquear temporalmente sillas para una función (10 minutos de expiración)
 *     tags: [Seats & Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seatIds
 *             properties:
 *               showtimeId:
 *                 type: integer
 *                 example: 1
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               durationMinutes:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 15
 *                 default: 10
 *                 description: Duración del bloqueo en minutos (1-15)
 *     responses:
 *       200:
 *         description: Sillas bloqueadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 lockedSeats:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Parámetros inválidos o durationMinutes fuera de rango
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Función o asiento no encontrado
 *       409:
 *         description: Sillas ya ocupadas o bloqueadas por otro usuario
 */
router.post("/lock-seats", authenticateJWT, lockSeats);

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
router.delete("/release-seats", authenticateJWT, releaseSeats);

/**
 * @swagger
 * /reservations/{showtimeId}/seats/{seatId}/lock:
 *   delete:
 *     summary: Liberar un asiento bloqueado (HU-010 contrato literal - alias bulk)
 *     tags: [Seats & Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bloqueo liberado correctamente
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Función no encontrada
 */
router.delete("/:showtimeId/seats/:seatId/lock", authenticateJWT, releaseSingleSeatLock);

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
router.get("/summary", authenticateJWT, getReservationsSummary);

export default router;