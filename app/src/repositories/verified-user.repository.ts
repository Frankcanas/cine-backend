import VerifiedUser, { IVerifiedUser } from '../models/verified-user.model';

export interface IVerifiedUserRepository {
  findByUserId(userId: number): Promise<IVerifiedUser | null>;
  createVerified(data: IVerifiedUser): Promise<void>;
}

class VerifiedUserRepository implements IVerifiedUserRepository {
  async findByUserId(userId: number): Promise<IVerifiedUser | null> {
    const record = await VerifiedUser.findOne({ where: { userId } });
    return record ? (record.toJSON() as IVerifiedUser) : null;
  }

  async createVerified(data: IVerifiedUser): Promise<void> {
    await VerifiedUser.create(data as any);
  }
}

export default new VerifiedUserRepository();
