// app/src/controllers/showtime.controller.ts

import { Request, Response } from "express";
import { ShowtimeService } from "../services/showtime.service";
import { ShowtimeFilterDto } from "../dto/showtime-filter.dto";

const showtimeService = new ShowtimeService();

export const getShowtimes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { movieId, roomId } = req.query;
    if (movieId) {
      const showtimes = await showtimeService.getShowtimesByMovie(Number(movieId));
      return res.status(200).json(showtimes);
    }
    if (roomId) {
      const showtimes = await showtimeService.getShowtimesByRoom(Number(roomId));
      return res.status(200).json(showtimes);
    }
    const showtimes = await showtimeService.getAllShowtimes();
    return res.status(200).json(showtimes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getShowtimeById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const showtime = await showtimeService.getShowtimeById(id);
    if (!showtime) {
      return res.status(404).json({ error: "Función no encontrada" });
    }
    return res.status(200).json(showtime);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createShowtime = async (req: Request, res: Response): Promise<Response> => {
  try {
    const showtime = await showtimeService.createShowtime(req.body);
    return res.status(201).json(showtime);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateShowtime = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const showtime = await showtimeService.updateShowtime(id, req.body);
    if (!showtime) {
      return res.status(404).json({ error: "Función no encontrada" });
    }
    return res.status(200).json(showtime);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteShowtime = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const deleted = await showtimeService.deleteShowtime(id);
    if (!deleted) {
      return res.status(404).json({ error: "Función no encontrada" });
    }
    return res.status(200).json({ message: "Función eliminada correctamente" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export const getShowtimesByMovieId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const movieId = Number(req.params.movieId);
    if (isNaN(movieId)) {
      return res.status(400).json({ error: "movieId inválido" });
    }

    const { format, language } = req.query;
    const filters: ShowtimeFilterDto = {
      format: format ? String(format) : undefined,
      language: language ? String(language) : undefined,
    };

    const showtimes = await showtimeService.getShowtimesForMovie(movieId, filters);
    return res.status(200).json(showtimes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
  };

