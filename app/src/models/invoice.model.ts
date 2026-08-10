// app/src/models/invoice.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Order from "./order.model";

export interface InvoiceAttributes {
  id: number;
  orderId: number;
  number: string;
  date: string;
  fileUrl?: string;
}

@Table({
  tableName: "invoices",
  timestamps: true,
})
export class Invoice extends Model {
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
    unique: true,
  })
  number!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: "file_url",
  })
  fileUrl?: string;
}

export type InvoiceCreationAttributes = Partial<InvoiceAttributes>;

export default Invoice;
