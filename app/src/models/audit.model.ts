// app/src/models/audit.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import User from "./user.model";

export interface AuditAttributes {
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId: number;
  ip: string;
  date: Date;
}

@Table({
  tableName: "audits",
  timestamps: true,
})
export class Audit extends Model {
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
    type: DataType.STRING(100),
    allowNull: false,
  })
  action!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  entity!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "entity_id",
  })
  entityId!: number;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
  })
  ip!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;
}

export type AuditCreationAttributes = Partial<AuditAttributes>;

export default Audit;