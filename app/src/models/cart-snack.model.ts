// app/src/models/cart-snack.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Cart from "./cart.model";
import Snack from "./snack.model";

export interface CartSnackAttributes {
  id: number;
  cartId: number;
  snackId: number;
  quantity: number;
  unitPrice: number;
}

@Table({
  tableName: "cart_snacks",
  timestamps: true,
})
export class CartSnack extends Model {
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

  @ForeignKey(() => Snack)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "snack_id",
  })
  snackId!: number;

  @BelongsTo(() => Snack)
  snack?: Snack;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: "unit_price",
  })
  unitPrice!: number;
}

export type CartSnackCreationAttributes = Partial<CartSnackAttributes>;

export default CartSnack;
