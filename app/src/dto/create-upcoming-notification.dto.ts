// app/src/dto/create-upcoming-notification.dto.ts

export interface CreateUpcomingNotificationDto {
  userId: number;
  movieId: number;
  notificationDate: Date | string;
  channel?: string;
  message?: string;
}
