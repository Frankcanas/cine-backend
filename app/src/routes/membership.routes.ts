import { Router } from "express";
import { createMembership, getAllMemberships, getBenefits } from "../controllers/membership.controller";

const router = Router();

/**
 * @swagger
 * /api/membership/create:
 *   post:
 *     summary: Crea una nueva membresía
 *     tags: [Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               durationDays:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.post("/create", createMembership);

/**
 * @swagger
 * /api/membership/benefits:
 *   get:
 *     summary: Obtener el catálogo de beneficios y descuentos por membresía
 *     tags: [Membership]
 *     responses:
 *       200:
 *         description: Lista de beneficios de membresías
 */
router.get("/benefits", getBenefits);

/**
 * @swagger
 * /api/membership:
 *   get:
 *     summary: Obtiene la lista de todas las membresías
 *     tags: [Membership]
 *     responses:
 *       200:
 *         description: Lista de membresías obtenida exitosamente
 */
router.get("/", getAllMemberships);

export default router;