// app/src/services/movie-release.service.ts

import { MovieReleaseRepository } from "../repositories/movie-release.repository";
import MovieRelease, { MovieReleaseCreationAttributes } from "../models/movie-release.model";
import { CreateMovieReleaseDto } from "../dto/create-movie-release.dto";

export class MovieReleaseService {
  private repository: MovieReleaseRepository;

  constructor() {
    this.repository = new MovieReleaseRepository();
  }

  async create(dto: CreateMovieReleaseDto): Promise<MovieRelease> {
    return await this.repository.create(dto);
  }

  async getAll(): Promise<MovieRelease[]> {
    return await this.repository.findAll();
  }

  async getById(id: number): Promise<MovieRelease | null> {
    return await this.repository.findById(id);
  }

  async getByMovieId(movieId: number): Promise<MovieRelease[]> {
    return await this.repository.findByMovieId(movieId);
  }

  async update(id: number, dto: Partial<CreateMovieReleaseDto>): Promise<MovieRelease | null> {
    await this.repository.update(id, dto);
    return await this.repository.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    return deleted > 0;
  }
}
