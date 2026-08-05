import Token, { IToken } from '../models/token.model';
import { ITokenRepository } from './interfaces/token.repository.interface';

export class TokenRepository implements ITokenRepository {
  async saveToken(tokenData: IToken): Promise<void> {
    await Token.create(tokenData as any);
  }

  async findLatestToken(userId: number, token: string): Promise<IToken | null> {
    const record = await Token.findOne({
      where: { userId, token },
      order: [['createdAt', 'DESC']],
    });

    return record ? (record.toJSON() as IToken) : null;
  }

  async deleteToken(userId: number, token: string): Promise<void> {
    await Token.destroy({ where: { userId, token } });
  }
}
