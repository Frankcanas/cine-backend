import { Router, Request, Response } from 'express';
import User from '../models/user.model';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Valida el correo y contraseña ingresados.
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
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Faltan datos
 *       401:
 *         description: Credenciales inválidas
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

        if (user.password !== password) {
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


