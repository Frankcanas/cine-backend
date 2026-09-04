// app/src/repositories/upcoming-notification.repository.ts

import UpcomingNotification, { UpcomingNotificationCreationAttributes } from "../models/upcoming-notification.model";
import User from "../models/user.model";
import Movie from "../models/movie.model";

export class UpcomingNotificationRepository {
  async create(data: UpcomingNotificationCreationAttributes): Promise<UpcomingNotification> {
    return await UpcomingNotification.create(data);
  }

  async findAll(): Promise<UpcomingNotification[]> {
    return await UpcomingNotification.findAll({
      include: [{ model: User }, { model: Movie }],
    });
  }

  async findById(id: number): Promise<UpcomingNotification | null> {
    return await UpcomingNotification.findByPk(id, {
      include: [{ model: User }, { model: Movie }],
    });
  }

  async findByUserId(userId: number): Promise<UpcomingNotification[]> {
    return await UpcomingNotification.findAll({
      where: { userId },
      include: [{ model: Movie }],
    });
  }

  async findByUserAndMovie(userId: number, movieId: number): Promise<UpcomingNotification | null> {
    return await UpcomingNotification.findOne({
      where: { userId, movieId },
    });
  }

  async update(id: number, data: Partial<UpcomingNotificationCreationAttributes>): Promise<[number]> {
    return await UpcomingNotification.update(data, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await UpcomingNotification.destroy({ where: { id } });
  }
}
