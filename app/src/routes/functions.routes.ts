// app/src/routes/functions.routes.ts
// Router público para HU-009 / HU-010 — paths exactos sin prefijo /api
// Reutiliza controllers internos showtime/seat (no renombra archivos)

import { Router } from "express";
import { getShowtimeById, getShowtimePrices } from "../controllers/showtime.controller";
import { getSeatsByShowtimeId } from "../controllers/seat.controller";

const router = Router();

/**
 * @swagger
 * /functions/{id}:
 *   get:
 *     summary: Detalle de una función (HU-009)
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle con sala y disponibilidad
 *       404:
 *         description: Función no encontrada
 */
router.get("/:id", getShowtimeById);

/**
 * @swagger
 * /functions/{id}/prices:
 *   get:
 *     summary: Precio de función (RN-037) sin caché desactualizada
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: membershipLevel
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Tarifas
 *       404:
 *         description: Función no encontrada
 */
router.get("/:id/prices", getShowtimePrices);

/**
 * @swagger
 * /functions/{id}/seats:
 *   get:
 *     summary: Matriz de asientos con estados (HU-010)
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Matriz AVAILABLE/OCCUPIED/LOCKED + isEnabled/type
 *       404:
 *         description: Función no encontrada
 */
router.get("/:id/seats", getSeatsByShowtimeId);

export default router;
