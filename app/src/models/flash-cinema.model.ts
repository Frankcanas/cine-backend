// app/src/models/flash-cinema.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Showtime from "./showtime.model";

export interface FlashCinemaAttributes {
  id: number;
  showtimeId: number;
  occupancyPercentage: number;
  discount: number;
  activationDate: Date;
  status: string;
}

@Table({
  tableName: "flash_cinemas",
  timestamps: true,
})
export class FlashCinema extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: "showtime_id",
  })
  showtimeId!: number;

  @BelongsTo(() => Showtime)
  showtime?: Showtime;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    field: "occupancy_percentage",
  })
  occupancyPercentage!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  discount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "activation_date",
  })
  activationDate!: Date;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "ACTIVE",
  })
  status!: string;
}

export type FlashCinemaCreationAttributes = Partial<FlashCinemaAttributes>;

export default FlashCinema;
