// app/src/models/pqrs.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import User from "./user.model";

export interface PqrsAttributes {
  id: number;
  userId: number;
  type: string;
  category: string;
  description: string;
  status: string;
  consecutive: string;
  date: Date;
}

@Table({
  tableName: "pqrs",
  timestamps: true,
})
export class Pqrs extends Model {
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

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  category!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  consecutive!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;
}

export type PqrsCreationAttributes = Partial<PqrsAttributes>;

export default Pqrs;