// app/src/dto/create-user.dto.ts

import { IntegerDataType } from "sequelize";

/**
 * DTO - Creación de Usuario
 * -------------------------
 * Este DTO representa la información necesaria para crear un nuevo usuario.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de usuarios.
 *
 * @property {string} name - Nombre completo del usuario.
 * @property {string} email - Dirección de correo electrónico única del usuario.
 * @property {string} phoneNumber - Numero de telefono completo unico del usuario 
 * @property {string} password - Contraseña

 *
 * @example
 * const dto: CreateUserDto = {
 *   name: "David Mtz",s
 *   email: "david@example.com"
 *   phoneNumber: "123456789"
 *   password: "*****"
 * };
 */

export interface PasswordValidationDto {
    lowercase: boolean;
    uppercase: boolean;
    hasNumber: boolean;
    specialCharacter: boolean;
    validLenght: boolean;
    isValid: boolean;
}
export interface CreateUserDto {

    /**
     * Nombre completo del usuario.
     */
    name: string;

    /**
     * Correo electrónico del usuario.
     */
    email: string;

    /**
     * Numero del usuario.
     */
    phoneNumber: string;

        /**
     * contraseña del usuario.
     */
    password: string;

    city: string;

    passwordStatus?: PasswordValidationDto;
}