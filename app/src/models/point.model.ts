// app/src/models/point.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Membership from "./membership.model";

export interface PointAttributes {
  id: number;
  membershipId: number;
  amount: number;
  obtainedDate: string;
  expirationDate: string;
  origin: string;
}

@Table({
  tableName: "points",
  timestamps: true,
})
export class Point extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Membership)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "membership_id",
  })
  membershipId!: number;

  @BelongsTo(() => Membership)
  membership?: Membership;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "obtained_date",
  })
  obtainedDate!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "expiration_date",
  })
  expirationDate!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  origin!: string;
}

export type PointCreationAttributes = Partial<PointAttributes>;

export default Point;
