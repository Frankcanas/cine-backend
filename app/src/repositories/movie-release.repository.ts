// app/src/repositories/movie-release.repository.ts

import MovieRelease, { MovieReleaseCreationAttributes } from "../models/movie-release.model";
import Movie from "../models/movie.model";

export class MovieReleaseRepository {
  async create(data: MovieReleaseCreationAttributes): Promise<MovieRelease> {
    return await MovieRelease.create(data);
  }

  async findAll(): Promise<MovieRelease[]> {
    return await MovieRelease.findAll({ include: [{ model: Movie }] });
  }

  async findById(id: number): Promise<MovieRelease | null> {
    return await MovieRelease.findByPk(id, { include: [{ model: Movie }] });
  }

  async findByMovieId(movieId: number): Promise<MovieRelease[]> {
    return await MovieRelease.findAll({ where: { movieId }, include: [{ model: Movie }] });
  }

  async update(id: number, data: Partial<MovieReleaseCreationAttributes>): Promise<[number]> {
    return await MovieRelease.update(data, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await MovieRelease.destroy({ where: { id } });
  }
}
