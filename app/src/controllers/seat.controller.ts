import { Request, Response } from "express";
import { seatService } from "../services/seat.service";

export const getSeatsByShowtimeId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const showtimeId = Number(req.params.showtimeId || req.params.id);
    if (isNaN(showtimeId)) {
      return res.status(400).json({ error: "showtimeId inválido" });
    }

    const seats = await seatService.getSeatsForShowtime(showtimeId);
    if (seats === null) {
      return res.status(404).json({ error: "Función (showtime) no encontrada" });
    }

    return res.status(200).json(seats);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const lockSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { showtimeId, seatIds, userId, durationMinutes } = req.body;
    // P1-10: priorizar req.userId del JWT; ignorar body userId si hay token
    const authUserId = (req as any).userId ? Number((req as any).userId) : Number(userId);

    if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0 || !authUserId || isNaN(authUserId)) {
      return res.status(400).json({ error: "showtimeId, seatIds (array) y userId son requeridos" });
    }

    // P1-9: validar durationMinutes 1..15 (HU pide 5-10, permitimos 1-15)
    let duration = 10;
    if (durationMinutes !== undefined) {
      duration = Number(durationMinutes);
      if (isNaN(duration) || duration < 1 || duration > 15) {
        return res.status(400).json({ error: "durationMinutes debe estar entre 1 y 15 minutos" });
      }
    }

    const result = await seatService.lockSeats(
      Number(showtimeId),
      seatIds.map(Number),
      authUserId,
      duration
    );

    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

export const releaseSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { showtimeId, seatIds, userId } = req.body;
    const authUserId = (req as any).userId ? Number((req as any).userId) : Number(userId);

    if (!showtimeId || !seatIds || !Array.isArray(seatIds) || !authUserId || isNaN(authUserId)) {
      return res.status(400).json({ error: "showtimeId, seatIds (array) y userId son requeridos" });
    }

    const result = await seatService.releaseSeats(
      Number(showtimeId),
      seatIds.map(Number),
      authUserId
    );

    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

export const releaseSingleSeatLock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const showtimeId = Number(req.params.showtimeId);
    const seatId = Number(req.params.seatId);
    const authUserId = Number((req as any).userId);
    if (isNaN(showtimeId) || isNaN(seatId) || !authUserId || isNaN(authUserId)) {
      return res.status(400).json({ error: "showtimeId, seatId y autenticación son requeridos" });
    }
    const released = await seatService.releaseSeats(showtimeId, [seatId], authUserId);
    return res.status(200).json({ success: true, releasedCount: released });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

export const getReservationsSummary = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = Number((req as any).userId || req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }

    const locks = await seatService.getUserLocks(userId);
    return res.status(200).json(locks);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};