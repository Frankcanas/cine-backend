import { Request, Response } from 'express';
import { AuthService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import verifiedUserRepository from '../repositories/verified-user.repository';
import { EmailService } from '../services/email.service';
import userService from '../services/user.service';
import { RequestTokenDTO, VerifyTokenDTO } from '../dto/create-token';
import User from '../models/user.model';
import { hashPassword, validatePassword } from '../utils/password';

export class AuthController {
  private authService: AuthService;
  private tokenRepository: TokenRepository;

  constructor() {
    this.tokenRepository = new TokenRepository();
    const emailService = new EmailService();
    this.authService = new AuthService(this.tokenRepository, verifiedUserRepository, emailService);
  }

  handleRequestToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.body as RequestTokenDTO;

      if (!userId) {
        return res.status(400).json({ error: 'El userId es obligatorio.' });
      }

      const user = await userService.findById(Number(userId));
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      await this.authService.requestVerificationToken(user.id, user.email);
      return res.status(200).json({ message: 'Código de verificación enviado al correo del usuario.' });
    } catch (error) {
      if (error instanceof Error && error.message === 'El usuario ya está verificado.') {
        return res.status(409).json({ error: 'El usuario ya está verificado.' });
      }
      return res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
  };

  handleVerifyToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, token } = req.body as VerifyTokenDTO;

      if (!userId || !token) {
        return res.status(400).json({ error: 'El userId y el token son obligatorios.' });
      }

      const user = await userService.findById(Number(userId));
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      const result = await this.authService.verifyToken(user.id, token);

      if (!result.success) {
        if (result.message === 'El usuario ya está verificado.') {
          return res.status(409).json({ error: result.message });
        }
        return res.status(400).json({ error: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      return res.status(500).json({ error: 'Error interno al verificar el token.' });
    }
  };

  handleResetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, token, newPassword } = req.body as {
        email: string;
        token: string;
        newPassword: string;
      };

      if (!email || !token || !newPassword) {
        return res.status(400).json({ error: 'Email, token y nueva contraseña son obligatorios.' });
      }

      const user = await userService.findAll();
      const targetUser = user.find((item) => item.email.toLowerCase() === email.toLowerCase());

      if (!targetUser) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      const resetToken = await this.tokenRepository.findLatestTokenByEmail(email, token);

      if (!resetToken) {
        return res.status(400).json({ error: 'Token inválido o no encontrado.' });
      }

      if (new Date() > new Date(resetToken.expiresAt)) {
        await this.tokenRepository.deleteToken(targetUser.id, token);
        return res.status(400).json({ error: 'El token ha expirado.' });
      }

      const passwordStatus = validatePassword(newPassword);
      if (!passwordStatus.isValid) {
        return res.status(400).json({
          error: 'La contraseña debe tener mayúscula, minúscula, número, carácter especial y 10 o más caracteres.',
        });
      }

      const hashedPassword = await hashPassword(newPassword);
      await User.update({ password: hashedPassword }, { where: { id: targetUser.id } });
      await this.tokenRepository.deleteToken(targetUser.id, token);

      return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      return res.status(500).json({ error: 'Error interno al restablecer la contraseña.' });
    }
  };
}
