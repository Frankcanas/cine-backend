// app/src/models/survey.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Order from "./order.model";
import User from "./user.model";

export interface SurveyAttributes {
  id: number;
  orderId?: number;
  userId: number;
  movieRating: number;
  roomRating: number;
  sound: number;
  comfort: number;
  service: number;
  recommendProbability: number;
  comments?: string;
}

@Table({
  tableName: "surveys",
  timestamps: true,
})
export class Survey extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
    field: "order_id",
  })
  orderId?: number;

  @BelongsTo(() => Order)
  order?: Order;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "movie_rating",
  })
  movieRating!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "room_rating",
  })
  roomRating!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sound!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  comfort!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  service!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "recommend_probability",
  })
  recommendProbability!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comments?: string;
}

export type SurveyCreationAttributes = Partial<SurveyAttributes>;

export default Survey;
