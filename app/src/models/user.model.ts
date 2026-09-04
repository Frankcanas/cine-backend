// app/src/models/user.model.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Membership from "./membreship.model";
import UpcomingNotification from "./upcoming-notification.model";
import Bonus from "./bonus.model";

/**
 * Atributos principales de la entidad `User`.
 */
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  city?: string;
  photoUrl?: string;
  notificationPreference?: boolean;
  membershipId?: number;
  points?: number;
  membershipStartDate?: Date;
  membershipCode?: string;
  isActive?: boolean;
  isVerified?: boolean;
  failedLoginAttempts?: number;
  lockoutUntil?: Date | null;
  refreshToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}

/**
 * Clase que representa el modelo `User` en Sequelize.
 */
export type UserCreationAttributes = Omit<UserAttributes, "id">;

@Table({
  tableName: "users",
  timestamps: true,
})
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  /** Identificador único del usuario (clave primaria). */
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

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
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  city?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  photoUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  notificationPreference!: boolean;

  @ForeignKey(() => Membership)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  membershipId?: number;

  @BelongsTo(() => Membership)
  membership?: Membership;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  points!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  membershipStartDate?: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
  })
  membershipCode?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActive!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  failedLoginAttempts!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lockoutUntil?: Date | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  refreshToken?: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  resetPasswordToken?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resetPasswordExpires?: Date | null;

  @HasMany(() => UpcomingNotification)
  notifications?: UpcomingNotification[];

  @HasMany(() => Bonus)
  bonuses?: Bonus[];
}

export default User;