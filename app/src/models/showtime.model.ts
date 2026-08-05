// app/src/models/showtime.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface ShowtimeAttributes {
  id: number;
  movieId: number;
  roomId: number;
  startTime: Date;
  endTime: Date;
  price: number;
}

@Table({
  tableName: "showtimes",
  timestamps: true,
})
export class Showtime extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  movieId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roomId!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endTime!: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;
}

export type ShowtimeCreationAttributes = Partial<ShowtimeAttributes>;

export default Showtime;
