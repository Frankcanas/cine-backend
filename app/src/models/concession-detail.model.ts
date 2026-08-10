// app/src/models/concession-detail.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Order from "./order.model";
import Snack from "./snack.model";

export interface ConcessionDetailAttributes {
  id: number;
  orderId: number;
  snackId: number;
  quantity: number;
  unitPrice: number;
}

@Table({
  tableName: "concession_details",
  timestamps: true,
})
export class ConcessionDetail extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "order_id",
  })
  orderId!: number;

  @BelongsTo(() => Order)
  order?: Order;

  @ForeignKey(() => Snack)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "snack_id",
  })
  snackId!: number;

  @BelongsTo(() => Snack)
  snack?: Snack;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: "unit_price",
  })
  unitPrice!: number;
}

export type ConcessionDetailCreationAttributes = Partial<ConcessionDetailAttributes>;

export default ConcessionDetail;
