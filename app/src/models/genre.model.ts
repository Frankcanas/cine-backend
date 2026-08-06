// app/src/models/genre.model.ts

import { Table, Column, Model, DataType, BelongsToMany } from "sequelize-typescript";
import Movie from "./movie.model";
import MovieGenre from "./movie-genre.model";

export interface GenreAttributes {
  id: number;
  tmdbGenreId?: number;
  name: string;
}

@Table({
  tableName: "genres",
  timestamps: true,
})
export class Genre extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  tmdbGenreId?: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @BelongsToMany(() => Movie, () => MovieGenre)
  movies?: Movie[];
}

export type GenreCreationAttributes = Partial<GenreAttributes>;

export default Genre;
