// app/src/services/auth.service.ts

import crypto from "crypto";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/password";
import { EmailService } from "./email.service";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds (e.g. 900 for 15m)
}

export interface LoginResult {
  tokens: AuthTokens;
  user: {
    id: number;
    name: string;
    email: string;
    city?: string;
    membershipCode?: string;
    points: number;
  };
}

export class AuthService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error: any = new Error("Credenciales inválidas");
      error.statusCode = 401;
      throw error;
    }

    // 1. Verificar bloqueo por intentos fallidos (HU-007)
    if (user.lockoutUntil && new Date() < new Date(user.lockoutUntil)) {
      const remainingMinutes = Math.ceil((new Date(user.lockoutUntil).getTime() - Date.now()) / (60 * 1000));
      const error: any = new Error(`Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta nuevamente en ${remainingMinutes} minuto(s).`);
      error.statusCode = 423; // Locked
      throw error;
    }

    // 2. Verificar contraseña
    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de bloqueo
        user.failedLoginAttempts = 0;
        await user.save();
        const error: any = new Error("Has superado el límite de 5 intentos fallidos. Tu cuenta ha sido bloqueada por 15 minutos.");
        error.statusCode = 423;
        throw error;
      }
      await user.save();
      const error: any = new Error(`Credenciales inválidas. Intentos restantes: ${5 - user.failedLoginAttempts}`);
      error.statusCode = 401;
      throw error;
    }

    // 3. Verificar si el usuario está verificado / activo (HU-006 / HU-007)
    if (!user.isVerified && !user.isActive) {
      const error: any = new Error("Tu cuenta no ha sido activada. Por favor verifica tu correo electrónico con el código de 6 dígitos.");
      error.statusCode = 403;
      throw error;
    }

    // Resetear contador de fallos tras login exitoso
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;

    // 4. Generar Access Token (15m) y Refresh Token (7 días)
    const secret = String(process.env.JWT_SECRET || "secret_key");
    const payload = { userId: user.id, email: user.email };

    const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    return {
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        membershipCode: user.membershipCode,
        points: user.points || 0,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      const error: any = new Error("Refresh token requerido");
      error.statusCode = 400;
      throw error;
    }

    const secret = String(process.env.JWT_SECRET || "secret_key");
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, secret);
    } catch {
      const error: any = new Error("Refresh token inválido o expirado");
      error.statusCode = 401;
      throw error;
    }

    const user = await userRepository.findByid(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      const error: any = new Error("Refresh token revocado o no coincide");
      error.statusCode = 401;
      throw error;
    }

    const payload = { userId: user.id, email: user.email };
    const newAccessToken = jwt.sign(payload, secret, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    };
  }

  async logout(userId: number): Promise<void> {
    const user = await userRepository.findByid(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { message: "Si el correo está registrado, se ha enviado un enlace de restablecimiento." };
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    try {
      await this.emailService.send({
        to: user.email,
        subject: "Recuperación de Contraseña - Multicine",
        html: `<h3>Recuperación de Contraseña</h3><p>Hola ${user.name},</p><p>Tu token para restablecer la contraseña es:</p><h2>${resetToken}</h2><p>Válido durante 1 hora.</p>`,
      });
    } catch (err) {
      console.error("Error al enviar email de recuperación:", err);
    }

    return { message: "Si el correo está registrado, se ha enviado un enlace de restablecimiento." };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (!token || !newPassword || newPassword.length < 10) {
      const error: any = new Error("Token y contraseña válida (mínimo 10 caracteres) requeridos");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      const error: any = new Error("Token de restablecimiento inválido o expirado");
      error.statusCode = 400;
      throw error;
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    await user.save();

    return { success: true, message: "Contraseña actualizada exitosamente." };
  }
}

export default new AuthService();
