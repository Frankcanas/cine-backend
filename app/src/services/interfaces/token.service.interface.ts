export interface IAuthService {
  requestVerificationToken(userId: number, email: string): Promise<void>;
  verifyToken(userId: number, token: string): Promise<{ success: boolean; message: string }>;
}
