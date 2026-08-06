// app/src/models/api-client.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface ApiClientAttributes {
  id: number;
  name: string;
  apiKey: string;
  authType: string;
  consumptionLimit: number;
  active: boolean;
}

@Table({
  tableName: "api_clients",
  timestamps: true,
})
export class ApiClient extends Model {
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

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    field: "api_key",
  })
  apiKey!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: "auth_type",
  })
  authType!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "consumption_limit",
  })
  consumptionLimit!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active!: boolean;
}

export type ApiClientCreationAttributes = Partial<ApiClientAttributes>;

export default ApiClient;