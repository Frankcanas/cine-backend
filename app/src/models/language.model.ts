// app/src/models/language.model.ts

import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Showtime from "./showtime.model";

export interface LanguageAttributes {
  id: number;
  name: string;
}

@Table({
  tableName: "languages",
  timestamps: true,
})
export class Language extends Model {
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

export type LanguageCreationAttributes = Partial<LanguageAttributes>;

export default Language;
