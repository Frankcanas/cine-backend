// app/src/services/tmdb.service.ts

import { tmdbConfig } from "../config/tmdb.config";
import { TMDBMovie, TMDBResponse, TMDBMovieDetails, TMDBGenreResponse } from "../types/tmdb.types";
import { TMDBMovieMapper, MappedMovie } from "../mappers/tmdb-movie.mapper";

/**
 * Servicio para consultar la API externa de TMDB
 */
export class TMDBService {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    if (tmdbConfig.accessToken) {
      this.headers["Authorization"] = `Bearer ${tmdbConfig.accessToken}`;
    }
  }

  private buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const url = new URL(`${tmdbConfig.baseUrl}${endpoint}`);
    if (tmdbConfig.apiKey && !tmdbConfig.accessToken) {
      url.searchParams.append("api_key", tmdbConfig.apiKey);
    }
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.append(key, String(val));
    });
    return url.toString();
  }

  async getPopularMovies(page = 1, language = "es-ES"): Promise<MappedMovie[]> {
    const url = this.buildUrl("/movie/popular", { page, language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error en TMDB Service (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  // FCB - Modificado: Se agregó endpoint para obtener películas en cines (Now Playing)
  async getNowPlayingMovies(page = 1, language = "es-ES"): Promise<MappedMovie[]> {
    const url = this.buildUrl("/movie/now_playing", { page, language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener cartelera de TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async getUpcomingMovies(page = 1, language = "es-ES"): Promise<MappedMovie[]> {
    const url = this.buildUrl("/movie/upcoming", { page, language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener próximos estrenos de TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async getTopRatedMovies(page = 1, language = "es-ES"): Promise<MappedMovie[]> {
    const url = this.buildUrl("/movie/top_rated", { page, language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener películas mejor valoradas de TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async searchMovies(query: string, page = 1, language = "es-ES"): Promise<MappedMovie[]> {
    const url = this.buildUrl("/search/movie", { query, page, language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al buscar películas en TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async getMovieDetails(tmdbId: number, language = "es-ES"): Promise<MappedMovie> {
    const url = this.buildUrl(`/movie/${tmdbId}`, { language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener detalle de TMDB ID ${tmdbId}: ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBMovieDetails;
    const mapped = TMDBMovieMapper.toDomainDetail(data);

    // Fetch credits & videos in parallel
    try {
      const [credits, videos] = await Promise.all([
        this.getMovieCredits(tmdbId),
        this.getMovieVideos(tmdbId),
      ]);

      const director = credits.crew?.find((c) => c.job === "Director")?.name;
      const cast = credits.cast?.slice(0, 8).map((c) => c.name) || [];
      const trailer = videos.find((v) => v.site === "YouTube" && v.type === "Trailer");
      const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;

      mapped.director = director;
      mapped.cast = cast;
      if (trailerUrl) mapped.trailerUrl = trailerUrl;
    } catch {
      // Non-blocking if credits/videos fail
    }

    return mapped;
  }

  async getMovieCredits(tmdbId: number): Promise<{ cast: any[]; crew: any[] }> {
    const url = this.buildUrl(`/movie/${tmdbId}/credits`);
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      return { cast: [], crew: [] };
    }
    return (await response.json()) as any;
  }

  async getMovieVideos(tmdbId: number): Promise<any[]> {
    const url = this.buildUrl(`/movie/${tmdbId}/videos`);
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as any;
    return data.results || [];
  }

  async getMovieRecommendations(tmdbId: number, page = 1, language = "es-ES"): Promise<MappedMovie[]> {
    const url = this.buildUrl(`/movie/${tmdbId}/recommendations`, { page, language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return (data.results || []).map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async getGenres(language = "es-ES"): Promise<{ id: number; name: string }[]> {
    const url = this.buildUrl("/genre/movie/list", { language });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener géneros de TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBGenreResponse;
    return data.genres;
  }
}
