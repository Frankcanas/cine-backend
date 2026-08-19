import { Request, Response } from "express";
import User from "../models/user.model";
import { comparePassword } from "../utils/password";

export const loginUser = async (req: Request, res: Response) => {
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
}