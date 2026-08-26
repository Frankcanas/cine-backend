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

  async lockSeats(
    showtimeId: number,
    seatIds: number[],
    userId: number,
    durationMinutes: number = 10
  ): Promise<{ success: boolean; lockedSeats: number[]; expiresAt: Date }> {
    // 1. Limpiar locks expirados
    await SeatLock.destroy({
      where: {
        showtimeId,
        expiresAt: { [Op.lte]: new Date() },
      },
    });

    // 2. Verificar boletos ya vendidos
    const soldTickets = await Ticket.findAll({
      where: {
        showtimeId,
        seatId: { [Op.in]: seatIds },
        status: "VALID",
      },
    });

    if (soldTickets.length > 0) {
      const soldIds = soldTickets.map((t) => t.seatId);
      const error: any = new Error(`Los siguientes asientos ya están vendidos: ${soldIds.join(", ")}`);
      error.statusCode = 409;
      throw error;
    }

    // 3. Verificar si están bloqueados por otro usuario
    const activeLocks = await SeatLock.findAll({
      where: {
        showtimeId,
        seatId: { [Op.in]: seatIds },
        userId: { [Op.ne]: userId },
        status: "LOCKED",
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (activeLocks.length > 0) {
      const lockedIds = activeLocks.map((l) => l.seatId);
      const error: any = new Error(`Los siguientes asientos están bloqueados por otro usuario: ${lockedIds.join(", ")}`);
      error.statusCode = 409;
      throw error;
    }

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // 4. Crear o actualizar locks
    for (const seatId of seatIds) {
      const existing = await SeatLock.findOne({
        where: { showtimeId, seatId, userId },
      });
      if (existing) {
        existing.expiresAt = expiresAt;
        existing.status = "LOCKED";
        await existing.save();
      } else {
        await SeatLock.create({
          showtimeId,
          seatId,
          userId,
          status: "LOCKED",
          expiresAt,
        });
      }
    }

    return {
      success: true,
      lockedSeats: seatIds,
      expiresAt,
    };
  }

  async releaseSeats(showtimeId: number, seatIds: number[], userId: number): Promise<number> {
    return await SeatLock.destroy({
      where: {
        showtimeId,
        seatId: { [Op.in]: seatIds },
        userId,
      },
    });
  }

  async getActiveUserLocks(userId: number): Promise<SeatLock[]> {
    return await SeatLock.findAll({
      where: {
        userId,
        status: "LOCKED",
        expiresAt: { [Op.gt]: new Date() },
      },
      include: [{ model: Showtime }, { model: Seat }],
    });
  }
}