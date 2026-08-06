// app/src/models/voucher.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import User from "./user.model";

export interface VoucherAttributes {
  id: number;
  buyerId: number;
  code: string;
  value: number;
  balance: number;
  message?: string;
  recipientName: string;
  recipientEmail: string;
  expirationDate: Date;
  status: string;
}

@Table({
  tableName: "vouchers",
  timestamps: true,
})
export class Voucher extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User as any)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "buyer_id",
  })
  buyerId!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  value!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  balance!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  message?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: "recipient_name",
  })
  recipientName!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: "recipient_email",
  })
  recipientEmail!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "expiration_date",
  })
  expirationDate!: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: "ACTIVE",
  })
  status!: string;
}

export type VoucherCreationAttributes = Partial<VoucherAttributes>;

export default Voucher;