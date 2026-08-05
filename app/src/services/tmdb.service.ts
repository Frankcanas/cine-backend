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

  async getPopularMovies(page = 1): Promise<MappedMovie[]> {
    const url = this.buildUrl("/movie/popular", { page, language: "es-ES" });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error en TMDB Service (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async searchMovies(query: string, page = 1): Promise<MappedMovie[]> {
    const url = this.buildUrl("/search/movie", { query, page, language: "es-ES" });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al buscar películas en TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBResponse<TMDBMovie>;
    return data.results.map((movie) => TMDBMovieMapper.toDomain(movie));
  }

  async getMovieDetails(tmdbId: number): Promise<MappedMovie> {
    const url = this.buildUrl(`/movie/${tmdbId}`, { language: "es-ES" });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener detalle de TMDB ID ${tmdbId}: ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBMovieDetails;
    return TMDBMovieMapper.toDomainDetail(data);
  }

  async getGenres(): Promise<{ id: number; name: string }[]> {
    const url = this.buildUrl("/genre/movie/list", { language: "es-ES" });
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Error al obtener géneros de TMDB (${response.status}): ${response.statusText}`);
    }
    const data = (await response.json()) as TMDBGenreResponse;
    return data.genres;
  }
}
