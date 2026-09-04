import { Router } from "express";
import { getMarketingMemberships, sendMembershipMarketingEmails } from "../controllers/marketing-email.controller";

const router = Router();

/**
 * @swagger
 * /api/marketing/memberships:
 *   get:
 *     summary: Obtener membresías disponibles para campañas de marketing
 *     tags: [Marketing]
 *     responses:
 *       200:
 *         description: Lista de membresías disponibles
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Gold"
 *                 description: "Acceso a estrenos, descuentos y prioridad en reservas."
 *                 level: "Premium"
 *                 price: 150000
 *       500:
 *         description: Error del servidor
 */
router.get("/memberships", getMarketingMemberships);

/**
 * @swagger
 * /api/marketing/send:
 *   post:
 *     summary: Enviar correo de marketing (individual o masivo)
 *     tags: [Marketing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "cliente@correo.com"
 *                 description: Correo individual al que se enviará la promoción. Si se envía, no es obligatorio membershipId en el caso de prueba directa.
 *               membershipId:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la membresía que se promociona. Si se envía email, se usa para personalizar el contenido del correo.
 *     responses:
 *       200:
 *         description: Correo o correos enviados correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Correo de marketing enviado correctamente."
 *               sent: 1
 *               membershipName: "Gold"
 *               email: "cliente@correo.com"
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error del servidor
 */
router.post("/send", sendMembershipMarketingEmails);

export default router;
