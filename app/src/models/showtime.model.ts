// app/src/models/showtime.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Movie from "./movie.model";
import Room from "./room.model";

export interface ShowtimeAttributes {
  id: number;
  movieId: number;
  roomId: number;
  startTime: Date;
  endTime: Date;
  price: number;
  language?: string;
  audioType?: string;
  format?: string;
  availableSeats?: number;
  status?: string;
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

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  movieId!: number;

  @BelongsTo(() => Movie)
  movie?: Movie;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roomId!: number;

  @BelongsTo(() => Room)
  room?: Room;

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

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    defaultValue: "Español",
  })
  language?: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    defaultValue: "DOBLADA",
  })
  audioType?: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    defaultValue: "2D",
  })
  format?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  availableSeats?: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "AVAILABLE",
  })
  status!: string;
}

export type ShowtimeCreationAttributes = Partial<ShowtimeAttributes>;

export default Showtime;
