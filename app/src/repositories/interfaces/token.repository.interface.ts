import { IToken } from '../../models/token.model';

export interface ITokenRepository {
  saveToken(tokenData: IToken): Promise<void>;
  findLatestToken(userId: number, token: string): Promise<IToken | null>;
  deleteToken(userId: number, token: string): Promise<void>;
}
