import { Router } from 'express';
import { AuthController } from '../controllers/token.controller';

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /api/auth/request-token:
 *   post:
 *     summary: Solicitar código de verificación por usuario registrado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del usuario registrado que recibirá el código.
 *     responses:
 *       200:
 *         description: Código de verificación enviado al correo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código de verificación enviado al correo del usuario."
 *       400:
 *         description: El userId es obligatorio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El userId es obligatorio."
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       409:
 *         description: El usuario ya está verificado y no puede solicitar un nuevo código.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El usuario ya está verificado."
 *       500:
 *         description: Error interno al procesar la solicitud.
 */
router.post('/request-token', authController.handleRequestToken);

/**
 * @openapi
 * /api/auth/verify-token:
 *   post:
 *     summary: Verificar código recibido para usuario registrado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - token
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               token:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Token validado con éxito.
 *       400:
 *         description: Email o token inválidos / Token expirado.
 *       500:
 *         description: Error interno al verificar el token.
 */
router.post('/verify-token', authController.handleVerifyToken);

export default router;
