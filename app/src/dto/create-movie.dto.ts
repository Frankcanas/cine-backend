// app/src/dto/create-movie.dto.ts

export interface CreateMovieDto {
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  synopsis?: string;
  duration?: number;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  rating?: number;
  genreIds?: number[];
}
