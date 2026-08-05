// app/src/models/movie.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;
}

export type MovieCreationAttributes = Partial<MovieAttributes>;

export default Movie;
