import { SeatStatusDto } from "../dto/seat-status.dto";
import { ISeatRepository } from "../repositories/interfaces/seat.repository.interface";
import { SeatRepository } from "../repositories/seat.repository";

export class SeatService {
  private seatRepository: ISeatRepository;

  constructor() {
    this.seatRepository = new SeatRepository();
  }

  async getSeatsForShowtime(showtimeId: number): Promise<SeatStatusDto[] | null> {
    return await this.seatRepository.findSeatsByShowtimeId(showtimeId);
  }
}

export const seatService = new SeatService();