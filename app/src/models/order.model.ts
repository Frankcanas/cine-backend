// app/src/models/order.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany } from "sequelize-typescript";
import User from "./user.model";
import Cart from "./cart.model";
import Payment from "./payment.model";
import Invoice from "./invoice.model";
import Ticket from "./ticket.model";
import ConcessionDetail from "./concession-detail.model";
import Survey from "./survey.model";

export interface OrderAttributes {
  id: number;
  userId: number;
  cartId: number;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  status: string;
  date: Date;
}

@Table({
  tableName: "orders",
  timestamps: true,
})
export class Order extends Model {
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

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: "cart_id",
  })
  cartId!: number;

  @BelongsTo(() => Cart)
  cart?: Cart;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  subtotal!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  discount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  taxes!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total!: number;

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

  @HasOne(() => Payment)
  payment?: Payment;

  @HasOne(() => Invoice)
  invoice?: Invoice;

  @HasMany(() => Ticket)
  tickets?: Ticket[];

  @HasMany(() => ConcessionDetail)
  concessionDetails?: ConcessionDetail[];

  @HasOne(() => Survey)
  survey?: Survey;
}

export type OrderCreationAttributes = Partial<OrderAttributes>;

export default Order;
