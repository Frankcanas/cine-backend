// app/src/models/user.model.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany } from "sequelize-typescript";
import Role from "./role.model";
import City from "./city.model";
import Cinema from "./cinema.model";
import Membership from "./membership.model";
import UpcomingNotification from "./upcoming-notification.model";
import Notification from "./notification.model";
import RefreshToken from "./refresh-token.model";
import SeatLock from "./seat-lock.model";
import Cart from "./cart.model";
import Order from "./order.model";
import Transfer from "./transfer.model";
import Voucher from "./voucher.model";
import PremiereRequest from "./premiere-request.model";
import Survey from "./survey.model";
import Pqrs from "./pqrs.model";
import Recommendation from "./recommendation.model";
import ChatHistory from "./chat-history.model";
import Audit from "./audit.model";

export interface UserAttributes {
  id: number;
  roleId: number;
  cityId?: number;
  favoriteCinemaId?: number;
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  gender?: string;
  email: string;
  phoneNumber: string;
  password: string;
  status: string;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "role_id",
  })
  roleId!: number;

  @BelongsTo(() => Role)
  role?: Role;

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
    field: "favorite_cinema_id",
  })
  favoriteCinemaId?: number;

  @BelongsTo(() => Cinema)
  favoriteCinema?: Cinema;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: "last_name",
  })
  lastName!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    field: "document_type",
  })
  documentType!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    unique: true,
    field: "document_number",
  })
  documentNumber!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "birth_date",
  })
  birthDate!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  gender?: string;

  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(30),
    unique: true,
    allowNull: false,
    field: "phone_number",
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "ACTIVE",
  })
  status!: string;

  @HasOne(() => Membership)
  membership?: Membership;

  @HasMany(() => UpcomingNotification)
  upcomingNotifications?: UpcomingNotification[];

  @HasMany(() => Notification)
  notifications?: Notification[];

  @HasMany(() => RefreshToken)
  refreshTokens?: RefreshToken[];

  @HasMany(() => SeatLock)
  seatLocks?: SeatLock[];

  @HasMany(() => Cart)
  carts?: Cart[];

  @HasMany(() => Order)
  orders?: Order[];

  @HasMany(() => Transfer, "originUserId")
  transfersSent?: Transfer[];

  @HasMany(() => Transfer, "destinationUserId")
  transfersReceived?: Transfer[];

  @HasMany(() => Voucher, "buyerId")
  vouchers?: Voucher[];

  @HasMany(() => PremiereRequest)
  premiereRequests?: PremiereRequest[];

  @HasMany(() => Survey)
  surveys?: Survey[];

  @HasMany(() => Pqrs)
  pqrsRecords?: Pqrs[];

  @HasMany(() => Recommendation)
  recommendations?: Recommendation[];

  @HasMany(() => ChatHistory)
  chatHistory?: ChatHistory[];

  @HasMany(() => Audit)
  audits?: Audit[];
}

export type UserCreationAttributes = Partial<UserAttributes>;

export default User;
