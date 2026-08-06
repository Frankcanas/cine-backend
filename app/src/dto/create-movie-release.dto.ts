// app/src/dto/create-movie-release.dto.ts

export interface CreateMovieReleaseDto {
  movieId: number;
  releaseDate: string;
  region?: string;
  releaseType?: string;
  notes?: string;
  isConfirmed?: boolean;
}
