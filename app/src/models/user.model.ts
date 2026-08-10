// app/src/models/user.model.ts

/**
 * Modelo de Usuario
 * -----------------
 * Este archivo define el modelo `User` de Sequelize, que representa la tabla `users` en la base de datos.
 * 
 * Contiene:
 *  - Atributos del modelo (`UserAttributes`).
 *  - Atributos requeridos para la creación (`UserCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 * 
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from "sequelize-typescript";

/**
 * Atributos principales de la entidad `User`.
 */
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  city: string;
}

/**
 * Clase que representa el modelo `User` en Sequelize.
 * 
 * Implementa los atributos definidos en `UserAttributes`.
 */
@Table({
  tableName: "users",
  timestamps: true,
})
class User extends Model<UserAttributes> implements UserAttributes {
  /** Identificador único del usuario (clave primaria). */
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  /** Nombre completo del usuario. */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  /** Dirección de correo electrónico única del usuario. */
  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
  })
  email!: string;
  
  /** Numero de telefono unico del usuario */
  @Column({
    type: DataType.STRING(30),
    unique: true,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city!: string;
}

export default User;