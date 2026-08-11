// app/src/models/movie-release.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Movie from "./movie.model";

export interface MovieReleaseAttributes {
  id: number;
  movieId: number;
  releaseDate: string;
  region?: string;
  releaseType?: string;
  notes?: string;
  isConfirmed?: boolean;
}

@Table({
  tableName: "movie_releases",
  timestamps: true,
})
export class MovieRelease extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  movieId!: number;

  @BelongsTo(() => Movie)
  movie?: Movie;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  releaseDate!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: "CO",
  })
  region!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: "THEATRICAL",
  })
  releaseType!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isConfirmed!: boolean;
}

export type MovieReleaseCreationAttributes = Partial<MovieReleaseAttributes>;

export default MovieRelease;
