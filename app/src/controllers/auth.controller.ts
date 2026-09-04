// app/src/controllers/auth.controller.ts

import { Request, Response } from "express";
import authService from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos" });
  }

  try {
    const result = await authService.login(email, password);
    return res.status(200).json({
      message: "¡Login exitoso!",
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      user: result.user,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  try {
    const tokens = await authService.refresh(refreshToken);
    return res.status(200).json({
      message: "Token refrescado exitosamente",
      ...tokens,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = Number((req as any).userId || req.body.userId);
    if (userId) {
      await authService.logout(userId);
    }
    return res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "El correo es requerido" });
  }

  try {
    const result = await authService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { token, newPassword } = req.body;

  try {
    const result = await authService.resetPassword(token, newPassword);
    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};
