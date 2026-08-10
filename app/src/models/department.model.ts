// app/src/models/department.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Country from "./country.model";
import City from "./city.model";

export interface DepartmentAttributes {
  id: number;
  countryId: number;
  name: string;
}

@Table({
  tableName: "departments",
  timestamps: true,
})
export class Department extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Country)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "country_id",
  })
  countryId!: number;

  @BelongsTo(() => Country)
  country?: Country;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @HasMany(() => City)
  cities?: City[];
}

export type DepartmentCreationAttributes = Partial<DepartmentAttributes>;

export default Department;
