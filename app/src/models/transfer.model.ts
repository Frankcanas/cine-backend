import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Ticket from "./ticket.model";

export interface TransferAttributes {
  id: number;
  ticketId: number;
  amount: number;
  status: string;
  transferCode: string;
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
    field: "ticket_id",
  })
  ticketId!: number;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: "transfer_code",
  })
  transferCode!: string;
}

export type TransferCreationAttributes = Partial<TransferAttributes>;

export default Transfer;
