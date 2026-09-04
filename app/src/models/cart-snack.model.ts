import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Cart from "./cart.model";

export interface CartSnackAttributes {
  id: number;
  cartId: number;
  snackName: string;
  quantity: number;
  price: number;
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

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: "snack_name",
  })
  snackName!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  price!: number;
}

export type CartSnackCreationAttributes = Partial<CartSnackAttributes>;

export default CartSnack;
