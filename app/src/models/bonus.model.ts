// app/src/models/bonus.model.ts
// HU-008 - Billetera de bonos para membresía digital
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";

export interface BonusAttributes {
  id: number;
  userId: number;
  code: string;
  amount: number;
  balance: number;
  description?: string;
  isUsed: boolean;
  expiresAt?: Date | null;
}

@Table({
  tableName: "bonuses",
  timestamps: true,
})
export class Bonus extends Model<BonusAttributes, Partial<BonusAttributes>> implements BonusAttributes {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "user_id" })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  code!: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  amount!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  balance!: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: "is_used" })
  isUsed!: boolean;

  @Column({ type: DataType.DATE, allowNull: true, field: "expires_at" })
  expiresAt?: Date | null;
}

export default Bonus;
