import { Router} from 'express';
import { loginUser } from '../services/auth.services';
const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: |
 *       Valida el correo y la contraseña ingresados. La contraseña enviada por el cliente
 *       se compara con el hash almacenado en la base de datos usando bcrypt.compare().
 *       Si coincide, se autentica al usuario.
 *     tags: 
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             example:
 *               message: "¡Login exitoso!"
 *               datos:
 *                 id: 1
 *                 name: "Ana García"
 *                 email: "ana@example.com"
 *       400:
 *         description: Faltan datos o request inválido
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */

router.post('/login', loginUser);

export default router;


