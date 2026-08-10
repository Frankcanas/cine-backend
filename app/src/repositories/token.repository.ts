import Token, { IToken } from '../models/token.model';
import { ITokenRepository } from './interfaces/token.repository.interface';

export class TokenRepository implements ITokenRepository {
  async saveToken(tokenData: IToken): Promise<void> {
    await Token.create(tokenData as any);
  }

  async findLatestTokenByUserId(userId: number): Promise<IToken | null> {
  const record = await Token.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
    return record ? (record.toJSON() as IToken) : null;
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

  async updateToken(userId: number, token: string, newTokenData: Partial<IToken>): Promise<void> {
    await Token.update(newTokenData, { where: { userId, token } });
  }
}

  
