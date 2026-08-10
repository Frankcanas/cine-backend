// app/src/models/refresh-token.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";

export interface RefreshTokenAttributes {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
}

@Table({
  tableName: "refresh_tokens",
  timestamps: true,
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    unique: true,
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "expires_at",
  })
  expiresAt!: Date;
}

export type RefreshTokenCreationAttributes = Partial<RefreshTokenAttributes>;

export default RefreshToken;
