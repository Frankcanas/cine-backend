// app/src/models/room.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Cinema from "./cinema.model";
import Showtime from "./showtime.model";

export interface RoomAttributes {
  id: number;
  cinemaId: number;
  name: string;
  capacity: number;
  type: string;
  screenType?: string;
  soundSystem?: string;
  totalRows?: number;
  seatsPerRow?: number;
  isActive?: boolean;
}

@Table({
  tableName: "rooms",
  timestamps: true,
})
export class Room extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Cinema)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cinemaId!: number;

  @BelongsTo(() => Cinema)
  cinema?: Cinema;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacity!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: "2D",
  })
  type!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  screenType?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  soundSystem?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalRows?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  seatsPerRow?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @HasMany(() => Showtime)
  showtimes?: Showtime[];
}

export type RoomCreationAttributes = Partial<RoomAttributes>;

export default Room;
