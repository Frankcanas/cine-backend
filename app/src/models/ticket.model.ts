// app/src/models/ticket.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import Order from "./order.model";
import Showtime from "./showtime.model";
import Seat from "./seat.model";
import Transfer from "./transfer.model";
import ShowtimeChange from "./showtime-change.model";

export interface TicketAttributes {
  id: number;
  orderId: number;
  showtimeId: number;
  seatId: number;
  qrCode: string;
  status: string;
  buyerName: string;
}

@Table({
  tableName: "tickets",
  timestamps: true,
})
export class Ticket extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "order_id",
  })
  orderId!: number;

  @BelongsTo(() => Order)
  order?: Order;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "showtime_id",
  })
  showtimeId!: number;

  @BelongsTo(() => Showtime)
  showtime?: Showtime;

  @ForeignKey(() => Seat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "seat_id",
  })
  seatId!: number;

  @BelongsTo(() => Seat)
  seat?: Seat;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    field: "qr_code",
  })
  qrCode!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "VALID",
  })
  status!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: "buyer_name",
  })
  buyerName!: string;

  @HasOne(() => Transfer)
  transfer?: Transfer;

  @HasOne(() => ShowtimeChange)
  showtimeChange?: ShowtimeChange;
}

export type TicketCreationAttributes = Partial<TicketAttributes>;

export default Ticket;