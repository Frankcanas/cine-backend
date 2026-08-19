import { Router, Request, Response } from 'express';
import User from '../models/user.model';
import { comparePassword } from '../utils/password';

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

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas (usuario no encontrado)' });
        }

        const passwordMatches = await comparePassword(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Credenciales inválidas (contraseña incorrecta)' });
        }

        return res.status(200).json({
            message: '¡Login exitoso!',
            datos: { 
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error });
    }
});

export default router;


