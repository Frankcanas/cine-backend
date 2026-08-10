// app/src/models/recommendation.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";
import Movie from "./movie.model";

export interface RecommendationAttributes {
  id: number;
  userId: number;
  movieId: number;
  reason?: string;
  date: string;
}

@Table({
  tableName: "recommendations",
  timestamps: true,
})
export class Recommendation extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "movie_id",
  })
  movieId!: number;

  @BelongsTo(() => Movie)
  movie?: Movie;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: string;
}

export type RecommendationCreationAttributes = Partial<RecommendationAttributes>;

export default Recommendation;
