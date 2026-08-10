// app/src/models/country.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Department from "./department.model";

export interface CountryAttributes {
  id: number;
  name: string;
}

@Table({
  tableName: "countries",
  timestamps: true,
})
export class Country extends Model {
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

  @HasMany(() => Department)
  departments?: Department[];
}

export type CountryCreationAttributes = Partial<CountryAttributes>;

export default Country;
