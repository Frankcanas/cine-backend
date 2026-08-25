import { Op } from "sequelize";
import Seat from "../models/seat.model";
import Showtime from "../models/showtime.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import { SeatStatusDto } from "../dto/seat-status.dto";
import { ISeatRepository } from "./interfaces/seat.repository.interface";

export class SeatRepository implements ISeatRepository {
  async findSeatsByShowtimeId(showtimeId: number): Promise<SeatStatusDto[] | null> {
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) return null;

    const seats = await Seat.findAll({
      where: { roomId: showtime.roomId },
      order: [
        ["row", "ASC"],
        ["column", "ASC"],
      ],
    });

    const tickets = await Ticket.findAll({
      where: { showtimeId, status: "VALID" },
    });
    const soldSeatIds = new Set(tickets.map((t) => t.seatId));

    const locks = await SeatLock.findAll({
      where: {
        showtimeId,
        status: "LOCKED",
        expiresAt: { [Op.gt]: new Date() },
      },
    });
    const lockedSeatIds = new Set(locks.map((l) => l.seatId));

    return seats.map((seat) => {
      let status = "AVAILABLE";
      if (seat.status !== "AVAILABLE") {
        status = seat.status;
      } else if (soldSeatIds.has(seat.id)) {
        status = "OCCUPIED";
      } else if (lockedSeatIds.has(seat.id)) {
        status = "LOCKED";
      }

      return {
        id: seat.id,
        row: seat.row,
        column: seat.column,
        type: seat.type,
        status,
      };
    });
  }
}