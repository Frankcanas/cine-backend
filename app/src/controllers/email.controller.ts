import crypto from 'crypto';
import { Request, Response } from 'express';
import { EmailService } from '../services/email.service';
import userService from '../services/user.service';
import { TokenRepository } from '../repositories/token.repository';

const emailService = new EmailService();
const tokenRepository = new TokenRepository();

export const EmailController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, subject, html } = req.body;

    if (!userId || !subject || !html) {
      res.status(400).json({ succes: false, message: 'Faltan datos requeridos' });
      return;
    }

    const user = await userService.findById(Number(userId));

    if (!user) {
      res.status(404).json({ succes: false, message: 'Usuario no encontrado' });
      return;
    }

    await emailService.send({
      to: user.email,
      subject,
      html,
    });

    res.status(200).json({
      succes: true,
      message: 'Correo enviado',
    });
  } catch (error: any) {
    res.status(500).json({
      succes: false,
      error: error.message || 'Error procesando el envio',
    });
  }
};

export const recoverPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, message: 'Debe enviar un email válido' });
      return;
    }

    const users = await userService.findAll();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existingUser) {
      res.status(404).json({ success: false, message: 'No existe un usuario con ese correo' });
      return;
    }

    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await tokenRepository.saveToken({
      userId: existingUser.id,
      email: existingUser.email,
      token,
      expiresAt,
    });

    await emailService.passwordRecoveryEmail(existingUser.email, token);

    res.status(200).json({
      success: true,
      message: 'Se ha enviado un correo con el token para recuperar la contraseña'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar la solicitud',
    });
  }
};