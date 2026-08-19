// app/src/services/movie.service.ts

import { MovieRepository } from "../repositories/movie.repository";
import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Genre from "../models/genre.model";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { MovieFilterDto } from "../dto/movie-filter.dto";
import { BillboardFilterDto } from "../dto/billboard-filter.dto";
import { BillboardPeriod, BillboardResponse,} from "../types/billboard.types";
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
  async getWeeklyBillboard(
  filter: BillboardFilterDto = {}
): Promise<BillboardResponse> {

  const from = new Date();

  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  return await this.buildBillboard(
    "weekly",
    from,
    to,
    filter
  );
}
async getTodayBillboard(
  filter: BillboardFilterDto = {}
): Promise<BillboardResponse> {

  const from = new Date();

  const to = new Date(from);
  to.setHours(24, 0, 0, 0);

  return await this.buildBillboard(
    "today",
    from,
    to,
    filter
  );
}
async getFilteredBillboard(
  filter: BillboardFilterDto
): Promise<BillboardResponse> {

  if (!filter.date) {

    const from = new Date();

    const to = new Date(from);
    to.setDate(to.getDate() + 7);

    return await this.buildBillboard(
      "filtered",
      from,
      to,
      filter
    );
  }

  const { from, to } =
    this.createDateRange(filter.date);

  return await this.buildBillboard(
    "filtered",
    from,
    to,
    filter
  );
}
private async buildBillboard(
  period: BillboardPeriod,
  from: Date,
  to: Date,
  filter: BillboardFilterDto
): Promise<BillboardResponse> {

  const movies =
    await this.movieRepository.findBillboard(
      from,
      to,
      filter
    );

  const formattedMovies = movies.map((movie) => {

    const data = movie.toJSON() as any;

    const showtimes =
      (data.showtimes ?? []).map(
        (showtime: any) => {

          const hasSeatInformation =
            showtime.availableSeats !== null &&
            showtime.availableSeats !== undefined;

          return {
            ...showtime,

            soldOut:
              hasSeatInformation &&
              Number(showtime.availableSeats) <= 0,
          };
        }
      );

    const availableFormats =
      Array.from(
        new Set<string>(
          showtimes.flatMap(
            (showtime: any) =>
              showtime.format
                ? [showtime.format]
                : []
          )
        )
      );

    const availableLanguages =
      Array.from(
        new Set<string>(
          showtimes.flatMap(
            (showtime: any) =>
              showtime.language
                ? [showtime.language]
                : []
          )
        )
      );

    return {
      ...data,
      showtimes,
      availableFormats,
      availableLanguages,
    };
  });

  // FCB - Modificado: Mezcla de películas de cartelera (TMDB Now Playing) con la base de datos local
  // Fetch TMDB Now Playing movies and mix them with the local movies
  try {
    const tmdbLanguage = filter.language || "es-ES";
    const tmdbMovies = await this.tmdbService.getNowPlayingMovies(1, tmdbLanguage);
    
    // Create a Set of local tmdbIds for quick filtering
    const localTmdbIds = new Set(
      formattedMovies.map((m) => m.tmdbId).filter(id => id != null)
    );
    
    // Format TMDB movies to match the Billboard structure
    const additionalTmdbMovies = tmdbMovies
      .filter((tmdbMovie) => !localTmdbIds.has(tmdbMovie.tmdbId))
      .map((tmdbMovie) => ({
        id: `tmdb-${tmdbMovie.tmdbId}`, // dummy id to distinguish them or keep it as tmdbId
        tmdbId: tmdbMovie.tmdbId,
        title: tmdbMovie.title,
        originalTitle: tmdbMovie.originalTitle,
        synopsis: tmdbMovie.synopsis,
        duration: tmdbMovie.duration || 120, // default if missing
        posterUrl: tmdbMovie.posterUrl,
        backdropUrl: tmdbMovie.backdropUrl,
        releaseDate: tmdbMovie.releaseDate,
        rating: tmdbMovie.rating,
        voteCount: tmdbMovie.voteCount,
        status: "EN_CARTELERA",
        isActive: true,
        genres: tmdbMovie.genres || [],
        showtimes: [], // No local functions yet
        availableFormats: [],
        availableLanguages: [],
      }));

    // Mix both arrays
    formattedMovies.push(...additionalTmdbMovies);
  } catch (err) {
    console.error("Error fetching TMDB movies for Billboard:", err);
    // If it fails, we just continue with local movies
  }

  return {
    period,
    from: from.toISOString(),
    to: to.toISOString(),
    totalMovies: formattedMovies.length,

    message:
      formattedMovies.length === 0
        ? "No existen funciones activas ni películas en cartelera para los filtros seleccionados."
        : undefined,

    movies: formattedMovies,
  };
}
private createDateRange(
  date: string
): {
  from: Date;
  to: Date;
} {

  const parts =
    date.split("-").map(Number);

  if (parts.length !== 3) {
    throw new Error(
      "La fecha debe tener formato YYYY-MM-DD"
    );
  }

  const [year, month, day] = parts;

  const from = new Date(
    year,
    month - 1,
    day,
    0,
    0,
    0,
    0
  );

  const isValidDate =
    from.getFullYear() === year &&
    from.getMonth() === month - 1 &&
    from.getDate() === day;

  if (!isValidDate) {
    throw new Error(
      "La fecha proporcionada no es válida"
    );
  }

  const to = new Date(from);

  to.setDate(
    to.getDate() + 1
  );

  return {
    from,
    to,
  };
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
