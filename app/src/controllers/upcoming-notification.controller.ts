// app/src/controllers/upcoming-notification.controller.ts

import { Request, Response } from "express";
import { UpcomingNotificationService } from "../services/upcoming-notification.service";

const service = new UpcomingNotificationService();

export const createNotification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const notification = await service.create(req.body);
    return res.status(201).json(notification);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.query;
    if (userId) {
      const notifications = await service.getByUserId(Number(userId));
      return res.status(200).json(notifications);
    }
    const notifications = await service.getAll();
    return res.status(200).json(notifications);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getNotificationById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const notification = await service.getById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    return res.status(200).json(notification);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateNotification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const notification = await service.update(id, req.body);
    if (!notification) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    return res.status(200).json(notification);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    return res.status(200).json({ message: "Notificación eliminada correctamente" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
