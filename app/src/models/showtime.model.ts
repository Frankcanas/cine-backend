// app/src/models/showtime.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from "sequelize-typescript";
import Movie from "./movie.model";
import Room from "./room.model";
import Format from "./format.model";
import Language from "./language.model";
import SeatLock from "./seat-lock.model";
import CartTicket from "./cart-ticket.model";
import Ticket from "./ticket.model";
import FlashCinema from "./flash-cinema.model";

export interface ShowtimeAttributes {
  id: number;
  movieId: number;
  roomId: number;
  formatId: number;
  languageId: number;
  startTime: Date;
  endTime: Date;
  price: number;
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

  @ForeignKey(() => Format)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "format_id",
  })
  formatId!: number;

  @BelongsTo(() => Format)
  format?: Format;

  @ForeignKey(() => Language)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "language_id",
  })
  languageId!: number;

  @BelongsTo(() => Language)
  language?: Language;

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

  @HasMany(() => SeatLock)
  seatLocks?: SeatLock[];

  @HasMany(() => CartTicket)
  cartTickets?: CartTicket[];

  @HasMany(() => Ticket)
  tickets?: Ticket[];

  @HasOne(() => FlashCinema)
  flashCinema?: FlashCinema;
}

export type ShowtimeCreationAttributes = Partial<ShowtimeAttributes>;

export default Showtime;
