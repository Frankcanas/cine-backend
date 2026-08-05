// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie, { MovieCreationAttributes } from "../../models/movie.model";
import { MovieFilterDto } from "../../dto/movie-filter.dto";

export interface IMovieRepository {
  create(movieData: MovieCreationAttributes): Promise<Movie>;
  findAll(filter?: MovieFilterDto): Promise<Movie[]>;
  findById(id: number): Promise<Movie | null>;
  findByTmdbId(tmdbId: number): Promise<Movie | null>;
  update(id: number, movieData: Partial<MovieCreationAttributes>): Promise<[number]>;
  delete(id: number): Promise<number>;
}
