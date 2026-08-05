import crypto from 'crypto';
import { IAuthService } from './interfaces/token.service.interface';
import { ITokenRepository } from '../repositories/interfaces/token.repository.interface';
import { IEmailService } from './interfaces/email.service.interface';

export class AuthService implements IAuthService {
  // Las dependencias se declaran usando sus interfaces, no las clases directamente
  constructor(
    private tokenRepository: ITokenRepository,
    private emailService: IEmailService
  ) {}

  async requestVerificationToken(userId: number, email: string): Promise<void> {
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.tokenRepository.saveToken({ userId, email, token, expiresAt });
    await this.emailService.sendVerificationEmail(email, token);
  }

  async verifyToken(userId: number, token: string): Promise<{ success: boolean; message: string }> {
    const record = await this.tokenRepository.findLatestToken(userId, token);

    if (!record) {
      return { success: false, message: 'El código introducido es incorrecto.' };
    }

    if (new Date() > record.expiresAt) {
      await this.tokenRepository.deleteToken(userId, token);
      return { success: false, message: 'El código ha expirado. Solicita uno nuevo.' };
    }

    await this.tokenRepository.deleteToken(userId, token);
    return { success: true, message: 'Token validado con éxito.' };
  }
}
