// app/src/repositories/showtime.repository.ts

import Showtime, { ShowtimeCreationAttributes } from "../models/showtime.model";
import { IShowtimeRepository } from "./interfaces/showtime.repository.interface";

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
}
