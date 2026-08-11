import crypto from 'crypto';
import { IAuthService } from './interfaces/token.service.interface';
import { ITokenRepository } from '../repositories/interfaces/token.repository.interface';
import { IVerifiedUserRepository } from '../repositories/interfaces/verified-user.repository.interface';
import { IEmailService } from './interfaces/email.service.interface';

export class AuthService implements IAuthService {
  // Las dependencias se declaran usando sus interfaces, no las clases directamente
  constructor(
    private tokenRepository: ITokenRepository,
    private verifiedUserRepository: IVerifiedUserRepository,
    private emailService: IEmailService
  ) {}

  async requestVerificationToken(userId: number, email: string): Promise<void> {
    const verifiedUser = await this.verifiedUserRepository.findByUserId(userId);

    if (verifiedUser) {
      throw new Error('El usuario ya está verificado.');
    }

    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    const existingToken = await this.tokenRepository.findLatestTokenByUserId(userId);

    if (existingToken) {
      await this.tokenRepository.updateToken(userId, existingToken.token, { token, expiresAt });
    } else {
      await this.tokenRepository.saveToken({ userId, email, token, expiresAt });
    }

    await this.emailService.sendVerificationEmail(email, token);

  }

  async verifyToken(userId: number, token: string): Promise<{ success: boolean; message: string }> {
    const verifiedUser = await this.verifiedUserRepository.findByUserId(userId);
    if (verifiedUser) {
      return { success: false, message: 'El usuario ya está verificado.' };
    }

    const record = await this.tokenRepository.findLatestToken(userId, token);

    if (!record) {
      return { success: false, message: 'El código introducido es incorrecto.' };
    }

    if (new Date() > record.expiresAt) {
      await this.tokenRepository.deleteToken(userId, token);
      return { success: false, message: 'El código ha expirado. Solicita uno nuevo.' };
    }

    await this.tokenRepository.deleteToken(userId, token);
    await this.verifiedUserRepository.createVerified({ userId, token, verifiedAt: new Date() });

    return { success: true, message: 'Token validado con éxito.' };
  }
}
