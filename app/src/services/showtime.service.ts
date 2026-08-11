// app/src/services/showtime.service.ts

import { ShowtimeRepository } from "../repositories/showtime.repository";
import Showtime, { ShowtimeAttributes, ShowtimeCreationAttributes } from "../models/showtime.model";
import { CreateShowtimeDto } from "../dto/create-showtime.dto";

export class ShowtimeService {
  private showtimeRepository: ShowtimeRepository;

  constructor() {
    this.showtimeRepository = new ShowtimeRepository();
  }

  async createShowtime(dto: CreateShowtimeDto): Promise<Showtime> {
    const showtimeData: ShowtimeCreationAttributes = {
      movieId: dto.movieId,
      roomId: dto.roomId,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      price: dto.price,
    };
    return await this.showtimeRepository.create(showtimeData);
  }

  async getAllShowtimes(): Promise<Showtime[]> {
    return await this.showtimeRepository.findAll();
  }

  async getShowtimeById(id: number): Promise<Showtime | null> {
    return await this.showtimeRepository.findById(id);
  }

  async getShowtimesByMovie(movieId: number): Promise<Showtime[]> {
    return await this.showtimeRepository.findByMovieId(movieId);
  }

  async getShowtimesByRoom(roomId: number): Promise<Showtime[]> {
    return await this.showtimeRepository.findByRoomId(roomId);
  }

  async updateShowtime(id: number, dto: Partial<CreateShowtimeDto>): Promise<Showtime | null> {
    const updateData: Partial<ShowtimeAttributes> = {};
    if (dto.movieId) updateData.movieId = dto.movieId;
    if (dto.roomId) updateData.roomId = dto.roomId;
    if (dto.startTime) updateData.startTime = new Date(dto.startTime);
    if (dto.endTime) updateData.endTime = new Date(dto.endTime);
    if (dto.price !== undefined) updateData.price = dto.price;

    await this.showtimeRepository.update(id, updateData);
    return await this.showtimeRepository.findById(id);
  }

  async deleteShowtime(id: number): Promise<boolean> {
    const affected = await this.showtimeRepository.delete(id);
    return affected > 0;
  }
}
