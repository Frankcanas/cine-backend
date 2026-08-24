// app/src/models/cart.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from "sequelize-typescript";
import User from "./user.model";
import CartTicket from "./cart-ticket.model";
import CartSnack from "./cart-snack.model";
import Order from "./order.model";

export interface CartAttributes {
  id: number;
  userId: number;
  status: string;
  expirationDate: Date;
}

@Table({
  tableName: "carts",
  timestamps: true,
})
export class Cart extends Model {
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

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "OPEN",
  })
  status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "expiration_date",
  })
  expirationDate!: Date;

  @HasMany(() => CartTicket)
  cartTickets?: CartTicket[];

  @HasMany(() => CartSnack)
  cartSnacks?: CartSnack[];

  @HasOne(() => Order)
  order?: Order;
}

export type CartCreationAttributes = Partial<CartAttributes>;

export default Cart;