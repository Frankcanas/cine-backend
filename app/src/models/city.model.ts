// app/src/models/city.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import Department from "./department.model";

export interface CityAttributes {
  id: number;
  departmentId: number;
  name: string;
  active: boolean;
}

@Table({
  tableName: "cities",
  timestamps: true,
})
export class City extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "department_id",
  })
  departmentId!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active!: boolean;
}

export type CityCreationAttributes = Partial<CityAttributes>;

export default City;