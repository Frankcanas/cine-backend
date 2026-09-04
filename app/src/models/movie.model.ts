// app/src/models/movie.model.ts

import { Table, Column, Model, DataType, HasMany, BelongsToMany } from "sequelize-typescript";
import Showtime from "./showtime.model";
import Genre from "./genre.model";
import MovieGenre from "./movie-genre.model";
import MovieRelease from "./movie-release.model";
import UpcomingNotification from "./upcoming-notification.model";

export interface MovieAttributes {
  id: number;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  synopsis?: string;
  duration?: number;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  rating?: number;
  voteCount?: number;
  tagline?: string;
  originalLanguage?: string;
  classification?: string;
  trailerUrl?: string;
  director?: string;
  cast?: string;
  status?: string;
  isActive?: boolean;
}

@Table({
  tableName: "movies",
  timestamps: true,
})
export class Movie extends Model {
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
  tmdbId?: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  originalTitle?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  synopsis?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration?: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  posterUrl?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  backdropUrl?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  releaseDate?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  rating?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  voteCount?: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  tagline?: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  originalLanguage?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  classification?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  trailerUrl?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  director?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  cast?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: "EN_CARTELERA",
  })
  status!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @BelongsToMany(() => Genre, () => MovieGenre)
  genres?: Genre[];

  @HasMany(() => Showtime)
  showtimes?: Showtime[];

  @HasMany(() => MovieRelease)
  releases?: MovieRelease[];

  @HasMany(() => UpcomingNotification)
  notifications?: UpcomingNotification[];
}

export type MovieCreationAttributes = Partial<MovieAttributes>;

export default Movie;
