// app/src/dto/showtime-filter.dto.ts

export interface ShowtimeFilterDto {
  format?: string;   // 2D, 3D, IMAX, VIP...
  language?: string; // Doblada, Subtitulada...
  audioType?: string; // DOBLADA / SUBTITULADA
  fecha?: string; // YYYY-MM-DD
  cinemaId?: number;
  roomId?: number;
  page?: number;
  limit?: number;
}