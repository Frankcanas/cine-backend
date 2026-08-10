// app/src/models/role.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import User from "./user.model";

export interface RoleAttributes {
  id: number;
  name: string;
}

@Table({
  tableName: "roles",
  timestamps: true,
})
export class Role extends Model {
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

  @HasMany(() => User)
  users?: User[];
}

export type RoleCreationAttributes = Partial<RoleAttributes>;

export default Role;
