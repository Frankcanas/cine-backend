import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";

export interface IVerifiedUser {
  userId: number;
  token?: string | null;
  verifiedAt: Date;
}

@Table({
  tableName: "verified_users",
  timestamps: true,
})
export class VerifiedUser extends Model<IVerifiedUser> implements IVerifiedUser {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  token?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  verifiedAt!: Date;
}

export default VerifiedUser;
