import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';

const router = Router();

/**
 * @openapi
 * /api/mail/email:
 *   post:
 *     summary: Enviar correo a usuario registrado
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - subject
 *               - html
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: Identificador del usuario registrado al que se enviará el correo.
 *               subject:
 *                 type: string
 *                 example: Prueba desde Swagger
 *               html:
 *                 type: string
 *                 example: "<h1>Funciono</h1>"
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *       400:
 *         description: Faltan datos requeridos o formato inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor o credenciales SMTP inválidas
 */
router.post('/email', EmailController);

export default router;
