// app/src/models/promotion.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import City from "./city.model";
import Cinema from "./cinema.model";
import Movie from "./movie.model";
import Coupon from "./coupon.model";

export interface PromotionAttributes {
  id: number;
  cityId?: number;
  cinemaId?: number;
  movieId?: number;
  type: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxQuantity?: number;
  stackable: boolean;
}

@Table({
  tableName: "promotions",
  timestamps: true,
})
export class Promotion extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => City)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "city_id",
  })
  cityId?: number;

  @BelongsTo(() => City)
  city?: City;

  @ForeignKey(() => Cinema)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "cinema_id",
  })
  cinemaId?: number;

  @BelongsTo(() => Cinema)
  cinema?: Cinema;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "movie_id",
  })
  movieId?: number;

  @BelongsTo(() => Movie)
  movie?: Movie;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: "discount_value",
  })
  discountValue!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "start_date",
  })
  startDate!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "end_date",
  })
  endDate!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "max_quantity",
  })
  maxQuantity?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  stackable!: boolean;

  @HasMany(() => Coupon)
  coupons?: Coupon[];
}

export type PromotionCreationAttributes = Partial<PromotionAttributes>;

export default Promotion;
