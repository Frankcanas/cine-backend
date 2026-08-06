// app/src/dto/movie-filter.dto.ts

export interface MovieFilterDto {
  genreId?: number;
  title?: string;
  releaseYear?: number;
  status?: string;
  page?: number;
  limit?: number;
}
