// app/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * ============================================================================
 * Middleware de Autenticación (JWT)
 * ============================================================================
 *
 * Verifica que la petición incluya un token JWT válido en el header
 * `Authorization: Bearer <token>`.
 *
 * Si el token es válido, adjunta el `userId` decodificado a `req.userId`
 * para que los controladores puedan usarlo sin volver a decodificar nada.
 *
 * Si el token falta, está mal formado o expiró, responde 401 y corta
 * la cadena de middlewares (el controlador nunca se ejecuta).
 * ============================================================================
 */

export interface JwtPayload {
  userId: number;
  email: string;
}

// Extiende el tipo Request de Express para incluir el userId autenticado.
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticación no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = (process.env.JWT_SECRET) as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default authenticateJWT;
