import { Request, Response } from 'express';
import { AuthService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import verifiedUserRepository from '../repositories/verified-user.repository';
import { EmailService } from '../services/email.service';
import userService from '../services/user.service';
import { RequestTokenDTO, VerifyTokenDTO } from '../dto/create-token';

export class AuthController {
  private authService: AuthService;

  constructor() {
    const tokenRepository = new TokenRepository();
    const emailService = new EmailService();
    this.authService = new AuthService(tokenRepository, verifiedUserRepository, emailService);
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
      // Verificar si el usuario ya está verificado
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
        // Verificar si el usuario ya está verificado (409) o si es otro tipo de error (400)
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
}
