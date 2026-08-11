// app/src/models/membership.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import User from "./user.model";

export interface MembershipAttributes {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description?: string;
}

@Table({
  tableName: "memberships",
  timestamps: true,
})
export class Membership extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  durationDays!: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  description?: string;

  @HasMany(() => User)
  users?: User[];
}

export default Membership;