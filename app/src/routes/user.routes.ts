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
import { createUser, getUsers, getProfile, updateProfile } from "../controllers/user.controller";
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
 *               - notificationPreference
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
 *               notificationPreference:
 *                 type: boolean
 *                 description: "Indica si el usuario acepta recibir notificaciones comerciales por correo."
 *                 example: true
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
 *               notificationPreference: true
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
 /**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado (HU-008)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente con membresía, QR, bonos, compras y reservas
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               phoneNumber: "123456789"
 *               city: "New York"
 *               photoUrl: "https://cdn.example.com/photos/3.jpg"
 *               notificationPreference: true
 *               membership:
 *                 active: true
 *                 level: "Oro"
 *                 points: 120
 *                 membershipName: "Oro"
 *                 benefits: "15% descuento y prioridad reservas"
 *                 expiresAt: "2026-09-18T00:00:00.000Z"
 *                 membershipCode: "MEM-A1B2C3-KRJ9"
 *                 qrCode: "MEM-A1B2C3-KRJ9"
 *                 qrCodeDataUrl: "data:image/png;base64,iVBORw0KGgo..."
 *                 discountPercentage: 15
 *               bonos: [{ id:1, code:"BONO-001", amount:5000, balance:5000, isUsed:false }]
 *               historialCompras: [{ id:1, total:25000, status:"PAID", paymentMethod:"CARD" }]
 *               historialPuntos: 120
 *               reservasActivas: [{ id:1, showtimeId:10, seatId:5, status:"LOCKED" }]
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/profile", authenticateJWT, getProfile);
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado (HU-008 RN-034)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "3001234567"
 *               city:
 *                 type: string
 *                 example: "Medellin"
 *               photoUrl:
 *                 type: string
 *                 example: "https://cdn.example.com/photo.jpg"
 *               notificationPreference:
 *                 type: boolean
 *                 example: true
 *               email:
 *                 type: string
 *                 example: "new.email@example.com"
 *                 description: "Si cambia, requiere re-validación (RN-034)"
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Email inválido
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Email ya registrado
 */
router.put("/profile", authenticateJWT, updateProfile);

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Obtener el perfil de un usuario por ID (admin/debug)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *   put:
 *     summary: Actualizar perfil de un usuario por ID (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               city:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               notificationPreference:
 *                 type: boolean
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 */
router.get("/profile/:id", authenticateJWT, getProfile);
router.put("/profile/:id", authenticateJWT, updateProfile);

export default router;
