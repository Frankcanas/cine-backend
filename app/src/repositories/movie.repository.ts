// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Genre from "../models/genre.model";
import Showtime from "../models/showtime.model";
import MovieRelease from "../models/movie-release.model";
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

    if (filter?.status) {
      whereClause.status = filter.status;
    }

    const includeOptions: any[] = [
      {
        model: Genre,
        through: { attributes: [] },
      },
      {
        model: Showtime,
      },
      {
        model: MovieRelease,
      },
    ];

    if (filter?.genreId) {
      includeOptions[0].where = { id: filter.genreId };
    }

    return await Movie.findAll({
      where: whereClause,
      include: includeOptions,
      order: [["id", "ASC"]],
    });
  }

  async findById(id: number): Promise<Movie | null> {
    return await Movie.findByPk(id, {
      include: [
        {
          model: Genre,
          through: { attributes: [] },
        },
        {
          model: Showtime,
        },
        {
          model: MovieRelease,
        },
      ],
    });
  }

  async findByTmdbId(tmdbId: number): Promise<Movie | null> {
    return await Movie.findOne({
      where: { tmdbId },
      include: [
        {
          model: Genre,
          through: { attributes: [] },
        },
        {
          model: Showtime,
        },
        {
          model: MovieRelease,
        },
      ],
    });
  }

  async update(id: number, movieData: Partial<MovieCreationAttributes>): Promise<[number]> {
    return await Movie.update(movieData, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await Movie.destroy({ where: { id } });
  }
}
