import { IVerifiedUser } from '../../models/verified-user.model';

export interface IVerifiedUserRepository {
  findByUserId(userId: number): Promise<IVerifiedUser | null>;
  createVerified(data: IVerifiedUser): Promise<void>;
}
