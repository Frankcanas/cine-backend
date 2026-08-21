// app/src/repositories/interfaces/user.repository.interface.ts

import User, { UserCreationAttributes } from "../../models/user.model";

/**
 * Contrato del Repositorio de Usuarios
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad User.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IUserRepository {

    /**
     * Crea un usuario.
     */
    create(data: UserCreationAttributes): Promise<User>;

    /**
     * Obtiene todos los usuarios.
     */
    findAll(): Promise<User[]>;

    /**
     * Obtiene un usuario por ID.
     */
    findByid(id: number): Promise<User | null>;

    /**
     * Obtiene un usuario por email.
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Obtiene un usuario por su ID, incluyendo la relación con su membresía.
     */
    findByIdWithMembership(id: number): Promise<User | null>;

}