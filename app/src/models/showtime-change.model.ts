// app/src/models/showtime-change.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Ticket from "./ticket.model";
import Showtime from "./showtime.model";

export interface ShowtimeChangeAttributes {
  id: number;
  ticketId: number;
  previousShowtimeId: number;
  newShowtimeId: number;
  valueDifference: number;
  date: Date;
}

@Table({
  tableName: "showtime_changes",
  timestamps: true,
})
export class ShowtimeChange extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: "ticket_id",
  })
  ticketId!: number;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "previous_showtime_id",
  })
  previousShowtimeId!: number;

  @BelongsTo(() => Showtime, "previousShowtimeId")
  previousShowtime?: Showtime;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "new_showtime_id",
  })
  newShowtimeId!: number;

  @BelongsTo(() => Showtime, "newShowtimeId")
  newShowtime?: Showtime;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: "value_difference",
  })
  valueDifference!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;
}

export type ShowtimeChangeCreationAttributes = Partial<ShowtimeChangeAttributes>;

export default ShowtimeChange;
