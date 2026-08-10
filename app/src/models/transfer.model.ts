// app/src/models/transfer.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Ticket from "./ticket.model";
import User from "./user.model";

export interface TransferAttributes {
  id: number;
  ticketId: number;
  originUserId: number;
  destinationUserId: number;
  status: string;
  date: Date;
}

@Table({
  tableName: "transfers",
  timestamps: true,
})
export class Transfer extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: "ticket_id",
  })
  ticketId!: number;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "origin_user_id",
  })
  originUserId!: number;

  @BelongsTo(() => User, "originUserId")
  originUser?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "destination_user_id",
  })
  destinationUserId!: number;

  @BelongsTo(() => User, "destinationUserId")
  destinationUser?: User;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;
}

export type TransferCreationAttributes = Partial<TransferAttributes>;

export default Transfer;
