// app/src/models/snack-category.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Snack from "./snack.model";

export interface SnackCategoryAttributes {
  id: number;
  name: string;
}

@Table({
  tableName: "snack_categories",
  timestamps: true,
})
export class SnackCategory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @HasMany(() => Snack)
  snacks?: Snack[];
}

export type SnackCategoryCreationAttributes = Partial<SnackCategoryAttributes>;

export default SnackCategory;
