// app/src/models/user.model.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Membership from "./membreship.model";
import UpcomingNotification from "./upcoming-notification.model";

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
  membershipId?: number;
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

  @ForeignKey(() => Membership)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  membershipId?: number;

  @BelongsTo(() => Membership)
  membership?: Membership;

  @HasMany(() => UpcomingNotification)
  notifications?: UpcomingNotification[];
}


export default User;