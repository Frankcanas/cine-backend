import { Request, Response } from "express";
import { seatService } from "../services/seat.service";

export const getSeatsByShowtimeId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const showtimeId = Number(req.params.showtimeId);
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