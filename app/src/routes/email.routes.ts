import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';

const router = Router();

/**
 * @openapi
 * /api/mail/email:
 *   post:
 *     summary: Probar el envío de correos con Nodemailer
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - html
 *             properties:
 *               to:
 *                 type: string
 *                 example: tu-correo-personal@gmail.com
 *               subject:
 *                 type: string
 *                 example: Prueba desde Swagger
 *               html:
 *                 type: string
 *                 example: "<h1>Funciono</h1>"
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *       500:
 *         description: Error en el servidor o credenciales SMTP inválidas
 */
router.post('/email', EmailController);

export default router;
