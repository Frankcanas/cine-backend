import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Ticket from "./ticket.model";
import Showtime from "./showtime.model";

export interface ShowtimeChangeAttributes {
  id: number;
  ticketId: number;
  oldShowtimeId: number;
  newShowtimeId: number;
  reason: string;
  status: string;
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
    field: "ticket_id",
  })
  ticketId!: number;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "old_showtime_id",
  })
  oldShowtimeId!: number;

  @BelongsTo(() => Showtime)
  oldShowtime?: Showtime;

  @ForeignKey(() => Showtime)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "new_showtime_id",
  })
  newShowtimeId!: number;

  @BelongsTo(() => Showtime)
  newShowtime?: Showtime;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  reason!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;
}

export type ShowtimeChangeCreationAttributes = Partial<ShowtimeChangeAttributes>;

export default ShowtimeChange;
