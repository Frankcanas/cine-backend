// app/src/models/room.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface RoomAttributes {
  id: number;
  cinemaId: number;
  name: string;
  capacity: number;
  type: string;
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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cinemaId!: number;

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
}

export type RoomCreationAttributes = Partial<RoomAttributes>;

export default Room;
