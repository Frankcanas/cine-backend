// app/src/services/movie.service.ts

import { MovieRepository } from "../repositories/movie.repository";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Genre from "../models/genre.model";
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
      voteCount: dto.voteCount,
      tagline: dto.tagline,
      originalLanguage: dto.originalLanguage,
      classification: dto.classification,
      trailerUrl: dto.trailerUrl,
      status: dto.status || "EN_CARTELERA",
      isActive: true,
    };

    const movie = await this.movieRepository.create(movieData);

    if (dto.genreIds && dto.genreIds.length > 0) {
      const genres = await Genre.findAll({ where: { id: dto.genreIds } });
      await (movie as any).$set("genres", genres);
    }

    return (await this.movieRepository.findById(movie.id)) || movie;
  }

  async getMovies(filter?: MovieFilterDto): Promise<Movie[]> {
    return await this.movieRepository.findAll(filter);
  }

  async getMovieById(id: number): Promise<Movie | null> {
    return await this.movieRepository.findById(id);
  }

  async syncGenresFromTmdb(): Promise<Genre[]> {
    const tmdbGenres = await this.tmdbService.getGenres();
    const syncedGenres: Genre[] = [];
    for (const g of tmdbGenres) {
      const [genre] = await Genre.findOrCreate({
        where: { tmdbGenreId: g.id },
        defaults: { tmdbGenreId: g.id, name: g.name },
      });
      if (genre.name !== g.name) {
        genre.name = g.name;
        await genre.save();
      }
      syncedGenres.push(genre);
    }
    return syncedGenres;
  }

  async syncWithTmdb(tmdbId: number): Promise<Movie> {
    // 1. Asegurar sincronización de géneros
    await this.syncGenresFromTmdb();

    // 2. Obtener detalle de TMDB
    const details = await this.tmdbService.getMovieDetails(tmdbId);

    // 3. Crear o actualizar película local
    let movie = await this.movieRepository.findByTmdbId(tmdbId);

    const payload: Partial<MovieCreationAttributes> = {
      tmdbId: details.tmdbId,
      title: details.title,
      originalTitle: details.originalTitle,
      synopsis: details.synopsis,
      duration: details.duration,
      posterUrl: details.posterUrl || undefined,
      backdropUrl: details.backdropUrl || undefined,
      releaseDate: details.releaseDate,
      rating: details.rating,
      voteCount: details.voteCount,
      tagline: details.tagline,
      originalLanguage: details.originalLanguage,
      status: "EN_CARTELERA",
      isActive: true,
    };

    if (!movie) {
      movie = await this.movieRepository.create(payload as MovieCreationAttributes);
    } else {
      await this.movieRepository.update(movie.id, payload);
      movie = (await this.movieRepository.findById(movie.id))!;
    }

    // 4. Asociar géneros de la película
    if (details.genres && details.genres.length > 0) {
      const genreTmdbIds = details.genres.map((g) => g.id);
      const localGenres = await Genre.findAll({ where: { tmdbGenreId: genreTmdbIds } });
      await (movie as any).$set("genres", localGenres);
    }

    return (await this.movieRepository.findById(movie.id))!;
  }

  async updateMovie(id: number, dto: Partial<CreateMovieDto>): Promise<Movie | null> {
    await this.movieRepository.update(id, dto);
    const movie = await this.movieRepository.findById(id);
    if (movie && dto.genreIds) {
      const genres = await Genre.findAll({ where: { id: dto.genreIds } });
      await (movie as any).$set("genres", genres);
    }
    return await this.movieRepository.findById(id);
  }

  async deleteMovie(id: number): Promise<boolean> {
    const affected = await this.movieRepository.delete(id);
    return affected > 0;
  }
}
