// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from "../models/movie.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import { MovieFilterDto } from "../dto/movie-filter.dto";
import { Op } from "sequelize";

export class MovieRepository implements IMovieRepository {
  async create(movieData: MovieCreationAttributes): Promise<Movie> {
    return await Movie.create(movieData);
  }

  async findAll(filter?: MovieFilterDto): Promise<Movie[]> {
    const whereClause: any = { isActive: true };

    if (filter?.title) {
      whereClause.title = { [Op.iLike]: `%${filter.title}%` };
    }

    return await Movie.findAll({ where: whereClause });
  }

  async findById(id: number): Promise<Movie | null> {
    return await Movie.findByPk(id);
  }

  async findByTmdbId(tmdbId: number): Promise<Movie | null> {
    return await Movie.findOne({ where: { tmdbId } });
  }

  async update(id: number, movieData: Partial<MovieCreationAttributes>): Promise<[number]> {
    return await Movie.update(movieData, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await Movie.destroy({ where: { id } });
  }
}
