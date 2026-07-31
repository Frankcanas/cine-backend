import { Request, Response } from 'express';
import { EmailService } from '../services/email.service';
import userService from '../services/user.service';

const emailService = new EmailService();

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