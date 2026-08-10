// app/src/models/coupon.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Promotion from "./promotion.model";

export interface CouponAttributes {
  id: number;
  promotionId: number;
  code: string;
  maxUses: number;
  currentUses: number;
}

@Table({
  tableName: "coupons",
  timestamps: true,
})
export class Coupon extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Promotion)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "promotion_id",
  })
  promotionId!: number;

  @BelongsTo(() => Promotion)
  promotion?: Promotion;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "max_uses",
  })
  maxUses!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "current_uses",
  })
  currentUses!: number;
}

export type CouponCreationAttributes = Partial<CouponAttributes>;

export default Coupon;
