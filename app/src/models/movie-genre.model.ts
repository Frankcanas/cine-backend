// app/src/models/movie-genre.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface MovieGenreAttributes {
  movieId: number;
  genreId: number;
}

@Table({
  tableName: "movie_genres",
  timestamps: false,
})
export class MovieGenre extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  movieId!: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  genreId!: number;
}

export default MovieGenre;
