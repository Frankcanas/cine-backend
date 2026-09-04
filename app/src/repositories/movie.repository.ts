// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from "../models/movie.model";
import Genre from "../models/genre.model";
import Showtime from "../models/showtime.model";
import MovieRelease from "../models/movie-release.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";
import { MovieFilterDto } from "../dto/movie-filter.dto";
import Room from "../models/room.model";
import Cinema from "../models/cinema.model";
import City from "../models/city.model";
import { BillboardFilterDto } from "../dto/billboard-filter.dto";

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
  async findBillboard(
  from: Date,
  to: Date,
  filter: BillboardFilterDto = {}
): Promise<Movie[]> {
  const movieWhere: any = {
    isActive: true,
  };

  if (filter.title) {
    movieWhere.title = {
      [Op.iLike]: `%${filter.title}%`,
    };
  }

  if (filter.classification) {
    movieWhere.classification = filter.classification;
  }

  const showtimeWhere: any = {
    startTime: {
      [Op.gte]: from,
      [Op.lt]: to,
    },
    status: "AVAILABLE",
  };

  if (filter.language) {
    showtimeWhere.language = filter.language;
  }

  if (filter.format) {
    showtimeWhere.format = filter.format;
  }

  if (filter.available === true) {
    showtimeWhere.availableSeats = {
      [Op.gt]: 0,
    };
  }

  const roomWhere: any = {
    isActive: true,
  };

  if (filter.roomType) {
    roomWhere.type = filter.roomType;
  }

  const cinemaWhere: any = {
    isActive: true,
  };

  if (filter.cinemaId) {
    cinemaWhere.id = filter.cinemaId;
  }

  // city is now filtered via the City include in the query below

  const genreInclude: any = {
    model: Genre,
    through: {
      attributes: [],
    },
    required: false,
  };

  if (filter.genreId) {
    genreInclude.where = {
      id: filter.genreId,
    };

    genreInclude.required = true;
  }

  return await Movie.findAll({
    where: movieWhere,

    include: [
      genreInclude,
      {
        model: Showtime,
        required: true,
        where: showtimeWhere,
        include: [
          {
            model: Room,
            required: true,
            where: roomWhere,
            include: [
              {
                model: Cinema,
                required: true,
                where: cinemaWhere,
                // FCB - Modificado: Integración de la entidad City en la búsqueda de cartelera
                include: filter.city ? [{ model: City, as: 'cityObj', where: { name: { [Op.iLike]: filter.city } } }] : [],
              },
            ],
          },
        ],
      },
    ],

    order: [
      [
        {
          model: Showtime,
          as: "showtimes",
        },
        "startTime",
        "ASC",
      ],
    ],

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

  async findFunctionsByMovieId(movieId: number): Promise<Showtime[]> {
    return await Showtime.findAll({
      where: {
        movieId,
        startTime: { [Op.gte]: new Date() },
        status: "AVAILABLE",
      },
      include: [
        {
          model: Room,
          include: [
            {
              model: Cinema,
              include: [{ model: City, as: "cityObj" }],
            },
          ],
        },
      ],
      order: [["startTime", "ASC"]],
    });
  }

  async update(id: number, movieData: Partial<MovieCreationAttributes>): Promise<[number]> {
    return await Movie.update(movieData, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await Movie.destroy({ where: { id } });
  }
}
