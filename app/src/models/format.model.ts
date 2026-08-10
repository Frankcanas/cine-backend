// app/src/models/format.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Showtime from "./showtime.model";

export interface FormatAttributes {
  id: number;
  name: string;
}

@Table({
  tableName: "formats",
  timestamps: true,
})
export class Format extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name!: string;

  @HasMany(() => Showtime)
  showtimes?: Showtime[];
}

export type FormatCreationAttributes = Partial<FormatAttributes>;

export default Format;
