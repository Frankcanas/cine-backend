// app/src/routes/seat.routes.ts
import { Router } from 'express';
import { getSeatsByShowtimeId } from "../controllers/seat.controller";
const router = Router();
/**
 * @swagger
 * /api/showtimes/{showtimeId}/seats:
 *   get:
 *     summary: Obtener la matriz de asientos de una función con su estado actual
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de asientos con su estado (AVAILABLE, OCCUPIED, LOCKED, etc.)
 *       404:
 *         description: Función no encontrada
 */
router.get("/:showtimeId/seats", getSeatsByShowtimeId);

export default router;