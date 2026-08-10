// app/src/models/snack.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import SnackCategory from "./snack-category.model";
import CartSnack from "./cart-snack.model";
import ConcessionDetail from "./concession-detail.model";

export interface SnackAttributes {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  available: boolean;
}

@Table({
  tableName: "snacks",
  timestamps: true,
})
export class Snack extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => SnackCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "category_id",
  })
  categoryId!: number;

  @BelongsTo(() => SnackCategory)
  category?: SnackCategory;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  available!: boolean;

  @HasMany(() => CartSnack)
  cartSnacks?: CartSnack[];

  @HasMany(() => ConcessionDetail)
  concessionDetails?: ConcessionDetail[];
}

export type SnackCreationAttributes = Partial<SnackAttributes>;

export default Snack;
