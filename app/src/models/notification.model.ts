// app/src/models/notification.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import User from "./user.model";

export interface NotificationAttributes {
  id: number;
  userId: number;
  type: string;
  channel: string;
  status: string;
  sentAt: Date;
  attempts: number;
}

@Table({
  tableName: "notifications",
  timestamps: true,
})
export class Notification extends Model {
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
  channel!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "sent_at",
  })
  sentAt!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempts!: number;
}

export type NotificationCreationAttributes = Partial<NotificationAttributes>;

export default Notification;