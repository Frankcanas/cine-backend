// app/src/services/movie.service.ts

import { MovieRepository } from "../repositories/movie.repository";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { MovieFilterDto } from "../dto/movie-filter.dto";
import { TMDBService } from "./tmdb.service";

export class MovieService {
  private movieRepository: MovieRepository;
  private tmdbService: TMDBService;

  constructor() {
    this.movieRepository = new MovieRepository();
    this.tmdbService = new TMDBService();
  }

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    const movieData: MovieCreationAttributes = {
      tmdbId: dto.tmdbId,
      title: dto.title,
      originalTitle: dto.originalTitle,
      synopsis: dto.synopsis,
      duration: dto.duration,
      posterUrl: dto.posterUrl,
      backdropUrl: dto.backdropUrl,
      releaseDate: dto.releaseDate,
      rating: dto.rating,
      isActive: true,
    };
    return await this.movieRepository.create(movieData);
  }

  async getMovies(filter?: MovieFilterDto): Promise<Movie[]> {
    return await this.movieRepository.findAll(filter);
  }

  async getMovieById(id: number): Promise<Movie | null> {
    return await this.movieRepository.findById(id);
  }

  async syncWithTmdb(tmdbId: number): Promise<Movie> {
    const existing = await this.movieRepository.findByTmdbId(tmdbId);
    if (existing) {
      return existing;
    }
    const details = await this.tmdbService.getMovieDetails(tmdbId);
    return await this.createMovie({
      tmdbId: details.tmdbId,
      title: details.title,
      originalTitle: details.originalTitle,
      synopsis: details.synopsis,
      duration: details.duration,
      posterUrl: details.posterUrl || undefined,
      backdropUrl: details.backdropUrl || undefined,
      releaseDate: details.releaseDate,
      rating: details.rating,
    });
  }

  async updateMovie(id: number, dto: Partial<CreateMovieDto>): Promise<Movie | null> {
    await this.movieRepository.update(id, dto);
    return await this.movieRepository.findById(id);
  }

  async deleteMovie(id: number): Promise<boolean> {
    const affected = await this.movieRepository.delete(id);
    return affected > 0;
  }
}
