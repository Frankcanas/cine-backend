// app/src/models/department.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import Country from "./country.model";

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

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;
}

export type DepartmentCreationAttributes = Partial<DepartmentAttributes>;

export default Department;