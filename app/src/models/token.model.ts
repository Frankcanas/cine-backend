import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface IToken {
  userId: number;
  email: string;
  token: string;
  expiresAt: Date;
}

@Table({
  tableName: "tokens",
  timestamps: true,
})
export class Token extends Model<IToken> implements IToken {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;
}

export default Token;
