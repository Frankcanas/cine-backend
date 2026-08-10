// app/src/models/payment.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Order from "./order.model";

export interface PaymentAttributes {
  id: number;
  orderId: number;
  paymentMethod: string;
  status: string;
  amount: number;
  gatewayReference?: string;
}

@Table({
  tableName: "payments",
  timestamps: true,
})
export class Payment extends Model {
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
    unique: true,
    field: "order_id",
  })
  orderId!: number;

  @BelongsTo(() => Order)
  order?: Order;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: "payment_method",
  })
  paymentMethod!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: "gateway_reference",
  })
  gatewayReference?: string;
}

export type PaymentCreationAttributes = Partial<PaymentAttributes>;

export default Payment;
