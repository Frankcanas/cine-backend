// FCB - Archivo creado
// app/src/models/city.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Country from "./country.model";
import Cinema from "./cinema.model";

@Table({
  tableName: "cities",
  timestamps: true,
})
export default class City extends Model {
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

  @ForeignKey(() => Country)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  countryId!: number;

  @BelongsTo(() => Country)
  country!: Country;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @HasMany(() => Cinema)
  cinemas!: Cinema[];
}
