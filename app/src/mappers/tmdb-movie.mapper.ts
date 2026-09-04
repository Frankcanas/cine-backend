// app/src/mappers/tmdb-movie.mapper.ts

import { TMDBMovie, TMDBMovieDetails } from "../types/tmdb.types";
import { tmdbConfig } from "../config/tmdb.config";

export interface MappedMovie {
  tmdbId: number;
  title: string;
  originalTitle: string;
  synopsis: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  duration?: number;
  tagline?: string;
  originalLanguage?: string;
  genreIds?: number[];
  genres?: { id: number; name: string }[];
  director?: string;
  cast?: string[];
  trailerUrl?: string;
}

/**
 * Mapper para transformar datos de TMDB a estructuras de nuestro dominio
 */
export class TMDBMovieMapper {
  static toDomain(tmdbMovie: TMDBMovie): MappedMovie {
    return {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      synopsis: tmdbMovie.overview,
      posterUrl: tmdbMovie.poster_path ? `${tmdbConfig.imageBaseUrl}${tmdbMovie.poster_path}` : null,
      backdropUrl: tmdbMovie.backdrop_path ? `${tmdbConfig.imageBaseUrl}${tmdbMovie.backdrop_path}` : null,
      releaseDate: tmdbMovie.release_date,
      rating: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      originalLanguage: tmdbMovie.original_language,
      genreIds: tmdbMovie.genre_ids,
    };
  }

  static toDomainDetail(details: TMDBMovieDetails): MappedMovie {
    const base = this.toDomain(details);
    return {
      ...base,
      duration: details.runtime,
      tagline: details.tagline,
      genres: details.genres ? details.genres.map((g) => ({ id: g.id, name: g.name })) : [],
    };
  }
}
