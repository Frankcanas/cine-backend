// app/src/models/seat.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Room from "./room.model";
import SeatLock from "./seat-lock.model";
import CartTicket from "./cart-ticket.model";
import Ticket from "./ticket.model";

export interface SeatAttributes {
  id: number;
  roomId: number;
  row: string;
  column: number;
  type: string;
  status: string;
}

@Table({
  tableName: "seats",
  timestamps: true,
})
export class Seat extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "room_id",
  })
  roomId!: number;

  @BelongsTo(() => Room)
  room?: Room;

  @Column({
    type: DataType.STRING(5),
    allowNull: false,
  })
  row!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  column!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "STANDARD",
  })
  type!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "AVAILABLE",
  })
  status!: string;

  @HasMany(() => SeatLock)
  seatLocks?: SeatLock[];

  @HasMany(() => CartTicket)
  cartTickets?: CartTicket[];

  @HasMany(() => Ticket)
  tickets?: Ticket[];
}

export type SeatCreationAttributes = Partial<SeatAttributes>;

export default Seat;
