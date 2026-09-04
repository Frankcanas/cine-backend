import { SeatStatusDto } from "../../dto/seat-status.dto";

export interface ISeatRepository {
  findSeatsByShowtimeId(showtimeId: number): Promise<SeatStatusDto[] | null>;
}