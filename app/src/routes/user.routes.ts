// app/src/routes/user.routes.ts

/**
 * Rutas de Usuario
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `User`.
 * 
 * Endpoints disponibles:
 *  - `POST /users/` : Crear un nuevo usuario.
 *  - `GET /users/`  : Obtener todos los usuarios registrados.
 * 
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createUser, getUsers, getProfile } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * POST /
 * -----
 * Crea un nuevo usuario en la base de datos.
 * 
 * Request Body:
 *  - `name`: string (obligatorio)
 *  - `email`: string (obligatorio, único)
 *  - `phoneNumber`: integer (obligatorio, unico)
 * 
 * Response:
 *  - 201 Created: Retorna el usuario creado en formato JSON.
 *  - 500 Internal Server Error: En caso de error en la creación.
 * 
 * 
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - password
 *               - city
 *              
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phoneNumber:
 *                  type: string
 *                  example: "123456789"
 *               password:
 *                  type: string
 *                  example: "*****"   
 *               city:   
 *                type: string
 *                example: "New York"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               phoneNumber: "123456789"
 *               password: "*****"
 *               city: "New York"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "El correo ya existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo crear el usuario"
 */
router.post("/", createUser);

/**
 * GET /
 * ----
 * Obtiene la lista completa de usuarios registrados en la base de datos.
 * 
 * Response:
 *  - 200 OK: Devuelve un array de usuarios en formato JSON.
 * 
 * 
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 phoneNumber: "123456789"
 *                 password: "*****"
 *               - id: 2
 *                 name: "Jane Doe"
 *                 email: "john.doe@example.com"
 *                 phoneNumber: "123456789"
 *                 password: "*****"
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los usuarios"
 */
router.get("/", getUsers);
/**
 * GET /profile
 * ------------
 * Devuelve los datos personales del usuario autenticado junto con el
 * estado de su membresía (activa/inactiva, puntos, nivel y beneficios).
 *
 * Requiere el header `Authorization: Bearer <token>` con un JWT válido
 * obtenido en `POST /api/auth/login`.
 *
 *
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Obtener el perfil de un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               phoneNumber: "123456789"
 *               city: "New York"
 *               membership:
 *                 active: true
 *                 level: "Gold"
 *                 points: 120
 *                 membershipName: "Premium"
 *                 benefits: "Acceso a estrenos anticipados"
 *                 expiresAt: "2026-09-18T00:00:00.000Z"
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.get("/profile/:id", authenticateJWT, getProfile);

export default router;


