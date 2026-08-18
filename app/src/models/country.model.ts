// FCB - Archivo creado
// app/src/models/country.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import City from "./city.model";

@Table({
  tableName: "countries",
  timestamps: true,
})
export default class Country extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @HasMany(() => City)
  cities!: City[];
}
