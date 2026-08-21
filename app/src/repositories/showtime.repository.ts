// app/src/repositories/showtime.repository.ts

import Showtime, { ShowtimeCreationAttributes } from "../models/showtime.model";
import { IShowtimeRepository } from "./interfaces/showtime.repository.interface";
import Room from "../models/room.model";
import Cinema from "../models/cinema.model";
import { ShowtimeFilterDto } from "../dto/showtime-filter.dto";
import { WhereOptions } from "sequelize";
export class ShowtimeRepository implements IShowtimeRepository {
  async create(showtimeData: ShowtimeCreationAttributes): Promise<Showtime> {
    return await Showtime.create(showtimeData);
  }

  async findAll(): Promise<Showtime[]> {
    return await Showtime.findAll();
  }

  async findById(id: number): Promise<Showtime | null> {
    return await Showtime.findByPk(id);
  }

  async findByMovieId(movieId: number): Promise<Showtime[]> {
    return await Showtime.findAll({ where: { movieId } });
  }

  async findByRoomId(roomId: number): Promise<Showtime[]> {
    return await Showtime.findAll({ where: { roomId } });
  }

  async update(id: number, showtimeData: Partial<ShowtimeCreationAttributes>): Promise<[number]> {
    return await Showtime.update(showtimeData, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await Showtime.destroy({ where: { id } });
  }
  
  async findByMovieWithFilters(movieId: number, filters: ShowtimeFilterDto): Promise<Showtime[]> {
  const where: WhereOptions = { movieId };
  if (filters.format) where.format = filters.format;
  if (filters.language) where.language = filters.language;

  return await Showtime.findAll({
    where,
    include: [
      {
        model: Room,
        include: [Cinema],
      },
    ],
    order: [["startTime", "ASC"]],
  });
}
}
  