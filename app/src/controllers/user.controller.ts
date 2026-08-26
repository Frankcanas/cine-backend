import { Request, Response } from "express";

import userService from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";

/**
 * ============================================================================
 * Controlador de Usuarios
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `User`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `UserService`.
 *
 * Responsabilidades:
 *  - Recibir y procesar las solicitudes HTTP.
 *  - Obtener la información enviada por el cliente.
 *  - Invocar el servicio correspondiente.
 *  - Construir la respuesta HTTP.
 *  - Retornar los códigos de estado apropiados.
 *
 * Este controlador NO debe:
 *  - Contener reglas de negocio.
 *  - Acceder directamente a la base de datos.
 *  - Ejecutar consultas mediante Sequelize.
 *  - Realizar validaciones complejas del dominio.
 *
 * Arquitectura:
 *
 * Cliente HTTP
 *      │
 * UserController
 *      │
 * UserService
 *      │
 * UserRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Crea un nuevo usuario.
 *
 * Recibe la información enviada por el cliente, construye el DTO de creación
 * y delega la operación al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 * {
 *   "name": "David Mtz",
 *   "email": "david@example.com"
 * }
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **201 Created**
 *   Usuario creado correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 *
 * @throws {Error}
 * Cualquier excepción generada por la capa de servicios será capturada
 * y retornada como una respuesta HTTP con código 500.
 */
export const createUser = async (req: Request, res: Response): Promise<Response> => {

    try {

        // Construcción del DTO recibido desde el cliente.
        const dto: CreateUserDto = req.body;

        // Validación para que el correo escrito tenga por lo menos un arroba.
        if (!dto.email || !dto.email.includes('@')) {
            return res.status(400).json({
                error: 'Email inválido'
            });
        }

        // Busqueda de usuarios registrados para evitar correos/numeros duplicados.
        const euser = await userService.findAll();

        // Validación para que el correo escrito no esté registrado.
        if (euser.some(u => u.email === dto.email)) {
            return res.status(400).json({
                error: 'Email ya registrado'
            });
        }

        //validación para que el número de teléfono escrito no esté registrado.
        if (euser.some(u => u.phoneNumber === dto.phoneNumber)) {
            return res.status(400).json({
                error: 'Número de teléfono ya registrado'
            });
        }

        if (dto.password.length < 10 && dto.password) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 10 caracteres'
            });
        }

        // Delega la lógica de negocio al servicio.
        const user = await userService.create(dto);

        // Retorna el recurso creado sin exponer el hash de la contraseña
        const userJson = user.toJSON ? user.toJSON() : { ...user };
        delete (userJson as any).password;

        return res.status(201).json(userJson);

    } catch (error: any) {

        // Errores de validación lanzados por el servicio deben retornar 400
        if (error && (error.code === 'INVALID_PASSWORD' || error.message && error.message.startsWith('Password inválida'))) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene el listado completo de usuarios.
 *
 * Delega la consulta a la capa de servicios, la cual será responsable de
 * aplicar cualquier regla de negocio antes de consultar el repositorio.
 *
 * @async
 *
 * @param {Request} _req
 * Objeto de la petición HTTP.
 *
 * En este endpoint no se utiliza, por ello se antepone "_" al nombre de la
 * variable para indicar explícitamente que el parámetro es requerido por
 * Express pero no será utilizado.
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Lista de usuarios obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 */
export const getUsers = async (_req: Request, res: Response): Promise<Response> => {

    try {

        // Solicita la información al servicio.
        const users = await userService.findAll();

        const sanitizedUsers = users.map((u: any) => {
            const json = u.toJSON ? u.toJSON() : { ...u };
            delete json.password;
            return json;
        });

        // Retorna la colección de usuarios sanitizada.
        return res.status(200).json(sanitizedUsers);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = Number((req as any).userId || req.params.id);

        if (!userId) {
            return res.status(400).json({ error: "userId no proporcionado" });
        }

        const profile = await userService.getProfile(userId);

        if (!profile) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        return res.status(200).json(profile);

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = Number((req as any).userId || req.params.id || req.body.userId);

        if (!userId) {
            return res.status(400).json({ error: "userId no proporcionado" });
        }

        const updated = await userService.updateProfile(userId, req.body);

        if (!updated) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const json = updated.toJSON ? updated.toJSON() : { ...updated };
        delete (json as any).password;

        return res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: json,
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};