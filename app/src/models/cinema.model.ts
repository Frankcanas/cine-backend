// app/src/models/cinema.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import City from "./city.model";
import Room from "./room.model";
import User from "./user.model";
import Promotion from "./promotion.model";

export interface CinemaAttributes {
  id: number;
  cityId: number;
  name: string;
  address: string;
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

  @ForeignKey(() => City)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "city_id",
  })
  cityId!: number;

  @BelongsTo(() => City)
  city?: City;

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

  @HasMany(() => User)
  favoritedByUsers?: User[];

  @HasMany(() => Promotion)
  promotions?: Promotion[];
}

export type CinemaCreationAttributes = Partial<CinemaAttributes>;

export default Cinema;
