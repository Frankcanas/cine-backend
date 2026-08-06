// app/src/services/upcoming-notification.service.ts

import { UpcomingNotificationRepository } from "../repositories/upcoming-notification.repository";
import UpcomingNotification, { UpcomingNotificationCreationAttributes } from "../models/upcoming-notification.model";
import { CreateUpcomingNotificationDto } from "../dto/create-upcoming-notification.dto";

export class UpcomingNotificationService {
  private repository: UpcomingNotificationRepository;

  constructor() {
    this.repository = new UpcomingNotificationRepository();
  }

  async create(dto: CreateUpcomingNotificationDto): Promise<UpcomingNotification> {
    const payload: UpcomingNotificationCreationAttributes = {
      userId: dto.userId,
      movieId: dto.movieId,
      notificationDate: typeof dto.notificationDate === "string" ? new Date(dto.notificationDate) : dto.notificationDate,
      channel: dto.channel,
      message: dto.message,
    };
    return await this.repository.create(payload);
  }

  async getAll(): Promise<UpcomingNotification[]> {
    return await this.repository.findAll();
  }

  async getById(id: number): Promise<UpcomingNotification | null> {
    return await this.repository.findById(id);
  }

  async getByUserId(userId: number): Promise<UpcomingNotification[]> {
    return await this.repository.findByUserId(userId);
  }

  async update(id: number, dto: Partial<CreateUpcomingNotificationDto>): Promise<UpcomingNotification | null> {
    const payload: Partial<UpcomingNotificationCreationAttributes> = {};
    if (dto.userId !== undefined) payload.userId = dto.userId;
    if (dto.movieId !== undefined) payload.movieId = dto.movieId;
    if (dto.channel !== undefined) payload.channel = dto.channel;
    if (dto.message !== undefined) payload.message = dto.message;
    if (dto.notificationDate !== undefined) {
      payload.notificationDate = typeof dto.notificationDate === "string" ? new Date(dto.notificationDate) : dto.notificationDate;
    }
    await this.repository.update(id, payload);
    return await this.repository.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    return deleted > 0;
  }
}
