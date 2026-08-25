// app/src/models/seat-lock.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Showtime from "./showtime.model";
import Seat from "./seat.model";
import User from "./user.model";

export interface SeatLockAttributes {
  id: number;
  showtimeId: number;
  seatId: number;
  userId: number;
  status: string;
  expiresAt: Date;
}

@Table({
  tableName: "seat_locks",
  timestamps: true,
})
export class SeatLock extends Model {
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
    field: "showtime_id",
  })
  showtimeId!: number;

  @BelongsTo(() => Showtime)
  showtime?: Showtime;

  @ForeignKey(() => Seat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "seat_id",
  })
  seatId!: number;

  @BelongsTo(() => Seat)
  seat?: Seat;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "LOCKED",
  })
  status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "expires_at",
  })
  expiresAt!: Date;
}

export type SeatLockCreationAttributes = Partial<SeatLockAttributes>;

export default SeatLock;