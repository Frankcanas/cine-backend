// app/src/models/cinema.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface CinemaAttributes {
  id: number;
  name: string;
  address: string;
  city: string;
}

@Table({
  tableName: "cinemas",
  timestamps: true,
})
export class Cinema extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  city!: string;
}

export type CinemaCreationAttributes = Partial<CinemaAttributes>;

export default Cinema;
