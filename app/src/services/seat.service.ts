import { SeatStatusDto } from "../dto/seat-status.dto";
import { ISeatRepository } from "../repositories/interfaces/seat.repository.interface";
import { SeatRepository } from "../repositories/seat.repository";

export class SeatService {
  private seatRepository: SeatRepository;

  constructor() {
    this.seatRepository = new SeatRepository();
  }

  async getSeatsForShowtime(showtimeId: number): Promise<SeatStatusDto[] | null> {
    return await this.seatRepository.findSeatsByShowtimeId(showtimeId);
  }

  async lockSeats(showtimeId: number, seatIds: number[], userId: number, durationMinutes: number = 10): Promise<any> {
    return await this.seatRepository.lockSeats(showtimeId, seatIds, userId, durationMinutes);
  }

  async releaseSeats(showtimeId: number, seatIds: number[], userId: number): Promise<any> {
    const deletedCount = await this.seatRepository.releaseSeats(showtimeId, seatIds, userId);
    return { success: true, releasedCount: deletedCount };
  }

  async getUserLocks(userId: number): Promise<any[]> {
    return await this.seatRepository.getActiveUserLocks(userId);
  }
}

export const seatService = new SeatService();