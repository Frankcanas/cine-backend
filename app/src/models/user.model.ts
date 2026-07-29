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

import { DataTypes, INTEGER, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `User`.
 */
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
  city: string;
}

/**
 * Atributos utilizados para la creación de un nuevo usuario.
 * 
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

/**
 * Clase que representa el modelo `User` en Sequelize.
 * 
 * Implementa los atributos definidos en `UserAttributes` y `UserCreationAttributes`.
 */
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  /** Identificador único del usuario (clave primaria). */
  public id!: number;

  /** Nombre completo del usuario. */
  public name!: string;

  /** Dirección de correo electrónico única del usuario. */
  public email!: string;
  
  /** Numero de telefono unico del usuario */
  public phoneNumber!: number;

  public password!: string;

  public city!: string;
}

/**
 * Inicialización del modelo `User` con la configuración de Sequelize.
 * 
 * - `id`: Entero autoincremental, clave primaria.
 * - `name`: Nombre obligatorio con máximo 100 caracteres.
 * - `email`: Correo electrónico único y obligatorio con máximo 100 caracteres.
 * - ´number´: Numero de telefono unico y olbigatorio 
 */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",      // Nombre del modelo en Sequelize
    tableName: "users",     // Nombre de la tabla en la base de datos
    timestamps: true,      // Incluye createdAt y updatedAt
  }
);

export default User;