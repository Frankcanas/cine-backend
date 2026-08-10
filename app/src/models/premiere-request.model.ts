// app/src/models/premiere-request.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";
import Movie from "./movie.model";

export interface PremiereRequestAttributes {
  id: number;
  userId: number;
  movieId: number;
  requestDate: string;
  notified: boolean;
}

@Table({
  tableName: "premiere_requests",
  timestamps: true,
})
export class PremiereRequest extends Model {
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
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "request_date",
  })
  requestDate!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  notified!: boolean;
}

export type PremiereRequestCreationAttributes = Partial<PremiereRequestAttributes>;

export default PremiereRequest;
