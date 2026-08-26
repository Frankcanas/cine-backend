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
    const authUserId = Number((req as any).userId || userId);

    if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0 || !authUserId) {
      return res.status(400).json({ error: "showtimeId, seatIds (array) y userId son requeridos" });
    }

    const result = await seatService.lockSeats(
      Number(showtimeId),
      seatIds.map(Number),
      authUserId,
      durationMinutes ? Number(durationMinutes) : 10
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
    const authUserId = Number((req as any).userId || userId);

    if (!showtimeId || !seatIds || !Array.isArray(seatIds) || !authUserId) {
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