// app/src/models/cinema.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Room from "./room.model";

export interface CinemaAttributes {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
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

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @HasMany(() => Room)
  rooms?: Room[];
}

export type CinemaCreationAttributes = Partial<CinemaAttributes>;

export default Cinema;
