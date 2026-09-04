// app/src/services/showtime.service.ts

import { ShowtimeRepository } from "../repositories/showtime.repository";
import Showtime, { ShowtimeAttributes, ShowtimeCreationAttributes } from "../models/showtime.model";
import { CreateShowtimeDto } from "../dto/create-showtime.dto";
import { ShowtimeFilterDto } from "../dto/showtime-filter.dto";

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

  async getShowtimeDetail(id: number): Promise<any | null> {
    return await (this.showtimeRepository as any).findByIdWithAvailability(id);
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
  async getShowtimesForMovie(movieId: number, filters: ShowtimeFilterDto): Promise<any[]> {
    return await this.showtimeRepository.findByMovieWithFilters(movieId, filters);
  }

  async getShowtimesForMoviePaginated(
    movieId: number,
    filters: ShowtimeFilterDto
  ): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    return await this.showtimeRepository.findByMovieWithFiltersPaginated(movieId, filters);
  }

  async getShowtimePrices(showtimeId: number, membershipLevel: number = 1): Promise<any> {
    const showtime = await this.showtimeRepository.findById(showtimeId);
    if (!showtime) {
      const error: any = new Error("Función no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const basePrice = Number(showtime.price) || 15000;
    const format = (showtime.format || "2D").toUpperCase();
    const roomType = ((showtime as any).room?.type || "STANDARD").toUpperCase();

    // Recargo por formato
    let formatMultiplier = 1.0;
    if (format === "3D") formatMultiplier = 1.3;
    if (format === "IMAX") formatMultiplier = 1.6;

    // Recargo por tipo de sala
    let roomMultiplier = 1.0;
    if (roomType === "VIP") roomMultiplier = 1.5;
    if (roomType === "4DX") roomMultiplier = 1.75;

    const standardPrice = Math.round(basePrice * formatMultiplier * roomMultiplier);
    const childPrice = Math.round(standardPrice * 0.75); // 25% descuento niños
    const seniorPrice = Math.round(standardPrice * 0.70); // 30% descuento adulto mayor

    // Descuento por membresía
    let memberDiscountPct = 5;
    if (membershipLevel >= 3) memberDiscountPct = 25;
    else if (membershipLevel === 2) memberDiscountPct = 15;

    const memberPrice = Math.round(standardPrice * (1 - memberDiscountPct / 100));

    return {
      showtimeId,
      basePrice,
      format,
      roomType,
      rates: {
        general: standardPrice,
        child: childPrice,
        senior: seniorPrice,
        member: memberPrice,
      },
      discounts: {
        memberDiscountPercentage: memberDiscountPct,
        childDiscountPercentage: 25,
        seniorDiscountPercentage: 30,
      },
    };
  }
}
