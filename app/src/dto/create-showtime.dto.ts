// app/src/dto/create-showtime.dto.ts

export interface CreateShowtimeDto {
  movieId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  price: number;
}
