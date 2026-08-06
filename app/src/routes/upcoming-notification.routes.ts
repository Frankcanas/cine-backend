// app/src/routes/upcoming-notification.routes.ts

import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} from "../controllers/upcoming-notification.controller";

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtener notificaciones de próximos estrenos
 *     tags: [UpcomingNotifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */
router.get("/", getNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Obtener una notificación por ID
 *     tags: [UpcomingNotifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la notificación
 *       404:
 *         description: Notificación no encontrada
 */
router.get("/:id", getNotificationById);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Programar una notificación de próximo estreno para un usuario
 *     tags: [UpcomingNotifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - movieId
 *               - notificationDate
 *             properties:
 *               userId:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *               notificationDate:
 *                 type: string
 *               channel:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notificación programada exitosamente
 */
router.post("/", createNotification);

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Actualizar estado o fecha de una notificación
 *     tags: [UpcomingNotifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Notificación actualizada
 */
router.put("/:id", updateNotification);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Eliminar/Cancelar una notificación
 *     tags: [UpcomingNotifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación eliminada
 */
router.delete("/:id", deleteNotification);

export default router;
