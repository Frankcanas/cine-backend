// app/src/models/cart-ticket.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Cart from "./cart.model";
import Showtime from "./showtime.model";
import Seat from "./seat.model";

export interface CartTicketAttributes {
  id: number;
  cartId: number;
  showtimeId: number;
  seatId: number;
  unitPrice: number;
  discount: number;
}

@Table({
  tableName: "cart_tickets",
  timestamps: true,
})
export class CartTicket extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "cart_id",
  })
  cartId!: number;

  @BelongsTo(() => Cart)
  cart?: Cart;

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
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: "unit_price",
  })
  unitPrice!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  discount!: number;
}

export type CartTicketCreationAttributes = Partial<CartTicketAttributes>;

export default CartTicket;
