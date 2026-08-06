// app/src/models/movie-genre.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import Movie from "./movie.model";
import Genre from "./genre.model";

export interface MovieGenreAttributes {
  movieId: number;
  genreId: number;
}

@Table({
  tableName: "movie_genres",
  timestamps: false,
})
export class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  movieId!: number;

  @ForeignKey(() => Genre)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  genreId!: number;
}

export default MovieGenre;
