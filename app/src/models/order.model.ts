import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Cart from "./cart.model";
import User from "./user.model";

export interface OrderAttributes {
  id: number;
  cartId: number;
  userId: number;
  total: number;
  status: string;
  paymentMethod: string;
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

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "cart_id",
  })
  cartId!: number;

  @BelongsTo(() => Cart)
  cart?: Cart;

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
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  total!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    field: "payment_method",
  })
  paymentMethod!: string;
}

export type OrderCreationAttributes = Partial<OrderAttributes>;

export default Order;
