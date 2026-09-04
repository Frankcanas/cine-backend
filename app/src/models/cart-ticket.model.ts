// app/src/models/cart-ticket.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Cart from "./cart.model";
import Seat from "./seat.model";
import Showtime from "./showtime.model";

export interface CartTicketAttributes {
  id: number;
  cartId: number;
  seatId: number;
  showtimeId?: number;
  price?: number;
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

  @ForeignKey(() => Seat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "seat_id",
  })
  seatId!: number;

  @BelongsTo(() => Seat)
  seat?: Seat;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "showtime_id",
  })
  showtimeId?: number;

  @BelongsTo(() => Showtime)
  showtime?: Showtime;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  price?: number;
}

export type CartTicketCreationAttributes = Partial<CartTicketAttributes>;

export default CartTicket;