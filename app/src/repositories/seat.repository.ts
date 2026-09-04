import { Op, Transaction, UniqueConstraintError } from "sequelize";
import Seat from "../models/seat.model";
import Showtime from "../models/showtime.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import { SeatStatusDto } from "../dto/seat-status.dto";
import { ISeatRepository } from "./interfaces/seat.repository.interface";
import sequelize from "../config/database";

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

    return seats.map((seat: any) => {
      let status = "AVAILABLE";
      // Inhabilitada tiene prioridad
      if ((seat as any).isEnabled === false) {
        status = "DISABLED";
      } else if (seat.status !== "AVAILABLE") {
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
        number: seat.column,
        type: seat.type,
        status,
        isEnabled: (seat as any).isEnabled !== false,
      };
    });
  }

  async lockSeats(
    showtimeId: number,
    seatIds: number[],
    userId: number,
    durationMinutes: number = 10
  ): Promise<{ success: boolean; lockedSeats: number[]; expiresAt: Date }> {
    return await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (t) => {
        // 0. Validar showtime existe (P0-4)
        const showtime = await Showtime.findByPk(showtimeId, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!showtime) {
          const error: any = new Error("Función (showtime) no encontrada");
          error.statusCode = 404;
          throw error;
        }

        // 0b. Validar que los seatIds pertenecen a la sala (P0-3)
        const validSeats = await Seat.findAll({
          where: { id: { [Op.in]: seatIds }, roomId: showtime.roomId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (validSeats.length !== seatIds.length) {
          const foundIds = new Set(validSeats.map((s) => s.id));
          const invalidIds = seatIds.filter((id) => !foundIds.has(id));
          const error: any = new Error(
            `Asiento inexistente o no pertenece a esta función: ${invalidIds.join(", ")}`
          );
          error.statusCode = 404;
          throw error;
        }

        // 1a. Validar sillas inhabilitadas (HU-010)
        const disabled = validSeats.filter((s: any) => s.isEnabled === false);
        if (disabled.length > 0) {
          const ids = disabled.map((s) => s.id);
          const error: any = new Error(`Sillas inhabilitadas no seleccionables: ${ids.join(", ")}`);
          error.statusCode = 409;
          throw error;
        }

        // 1b. Validar límite máximo por función (configurable, default 6)
        const maxSeats = (showtime as any).maxSeatsPerReservation ?? 6;
        if (seatIds.length > maxSeats) {
          const error: any = new Error(`Máximo ${maxSeats} sillas por función. Solicitadas: ${seatIds.length}`);
          error.statusCode = 400;
          throw error;
        }
        // Si el usuario ya tiene locks activos, no exceder el máximo acumulado
        const existingLocks = await SeatLock.findAll({
          where: { showtimeId, userId, status: "LOCKED", expiresAt: { [Op.gt]: new Date() } },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const existingIds = new Set(existingLocks.map((l) => l.seatId));
        const newSeatsCount = seatIds.filter((id) => !existingIds.has(id)).length;
        if (existingLocks.length + newSeatsCount > maxSeats) {
          const error: any = new Error(
            `Excede máximo ${maxSeats} sillas por función. Ya tienes ${existingLocks.length} bloqueadas, intentas agregar ${newSeatsCount} más`
          );
          error.statusCode = 400;
          throw error;
        }

        // 1. Limpiar locks expirados (dentro de la transacción)
        await SeatLock.destroy({
          where: {
            showtimeId,
            expiresAt: { [Op.lte]: new Date() },
          },
          transaction: t,
        });

        // 2. Verificar boletos ya vendidos (con lock)
        const soldTickets = await Ticket.findAll({
          where: {
            showtimeId,
            seatId: { [Op.in]: seatIds },
            status: "VALID",
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (soldTickets.length > 0) {
          const soldIds = soldTickets.map((t) => t.seatId);
          const error: any = new Error(`Los siguientes asientos ya están vendidos: ${soldIds.join(", ")}`);
          error.statusCode = 409;
          throw error;
        }

        // 3. Verificar si están bloqueados por otro usuario (con lock)
        const activeLocks = await SeatLock.findAll({
          where: {
            showtimeId,
            seatId: { [Op.in]: seatIds },
            userId: { [Op.ne]: userId },
            status: "LOCKED",
            expiresAt: { [Op.gt]: new Date() },
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (activeLocks.length > 0) {
          const lockedIds = activeLocks.map((l) => l.seatId);
          const error: any = new Error(`Los siguientes asientos están bloqueados por otro usuario: ${lockedIds.join(", ")}`);
          error.statusCode = 409;
          throw error;
        }

        // RN-039: bloqueo fijo 10 minutos (ignora durationMinutes param para cumplir spec)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // 4. Crear o actualizar locks (defensa en profundidad: captura UniqueConstraintError → 409)
        for (const seatId of seatIds) {
          const existing = await SeatLock.findOne({
            where: { showtimeId, seatId, userId },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (existing) {
            existing.expiresAt = expiresAt;
            existing.status = "LOCKED";
            await existing.save({ transaction: t });
          } else {
            try {
              await SeatLock.create(
                {
                  showtimeId,
                  seatId,
                  userId,
                  status: "LOCKED",
                  expiresAt,
                },
                { transaction: t }
              );
            } catch (err: any) {
              if (err instanceof UniqueConstraintError) {
                const error: any = new Error(`El asiento ${seatId} fue bloqueado concurrentemente por otro usuario`);
                error.statusCode = 409;
                throw error;
              }
              throw err;
            }
          }
        }

        return {
          success: true,
          lockedSeats: seatIds,
          expiresAt,
        };
      }
    );
  }

  async releaseSeats(showtimeId: number, seatIds: number[], userId: number): Promise<number> {
    // P0-4: validar showtime existe
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) {
      const error: any = new Error("Función (showtime) no encontrada");
      error.statusCode = 404;
      throw error;
    }
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