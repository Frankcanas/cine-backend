// app/src/controllers/showtime.controller.ts

import { Request, Response } from "express";
import { ShowtimeService } from "../services/showtime.service";
import { ShowtimeFilterDto } from "../dto/showtime-filter.dto";
import Movie from "../models/movie.model";

const showtimeService = new ShowtimeService();

const ALLOWED_FORMATS = ["2D", "3D", "IMAX", "4DX", "VIP"];
const ALLOWED_LANGUAGES = [
  "Español",
  "Inglés",
  "English",
  "Doblada",
  "Subtitulada",
  "DOBLADA",
  "SUBTITULADA",
  "ESPAÑOL",
  "INGLÉS",
  "INGLES",
];

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
    const showtime = await showtimeService.getShowtimeDetail(id);
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
    // P1-7: soporta tanto /api/movies/:id/showtimes (param id) como legacy :movieId
    const movieId = Number((req.params as any).movieId ?? (req.params as any).id);
    if (isNaN(movieId)) {
      return res.status(400).json({ error: "movieId inválido" });
    }

    // P1-7: 404 si película no existe
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    const { format, language, audioType, fecha, cinemaId, roomId, page, limit } = req.query as any;

    // P1-8: validación allowlist format/language (case-insensitive)
    if (format) {
      const fmt = String(format).trim().toUpperCase();
      const allowedUpper = ALLOWED_FORMATS.map((f) => f.toUpperCase());
      if (!allowedUpper.includes(fmt)) {
        return res.status(400).json({
          error: `Formato inválido: ${format}. Valores permitidos: ${ALLOWED_FORMATS.join(", ")}`,
          allowed: ALLOWED_FORMATS,
        });
      }
    }
    if (language) {
      const langUpper = String(language).trim().toUpperCase();
      const allowedLangUpper = ALLOWED_LANGUAGES.map((l) => l.toUpperCase());
      const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (
        !allowedLangUpper
          .map((v) => normalize(v))
          .includes(normalize(langUpper))
      ) {
        return res.status(400).json({
          error: `Idioma inválido: ${language}. Valores permitidos: ${ALLOWED_LANGUAGES.join(", ")}`,
          allowed: ALLOWED_LANGUAGES,
        });
      }
    }
    const ALLOWED_AUDIOTYPES = ["DOBLADA", "SUBTITULADA", "DOBLADO", "SUBTITULADO"];
    if (audioType) {
      const aud = String(audioType).trim().toUpperCase();
      if (!ALLOWED_AUDIOTYPES.includes(aud)) {
        return res.status(400).json({
          error: `audioType inválido: ${audioType}. Valores permitidos: ${ALLOWED_AUDIOTYPES.join(", ")}`,
          allowed: ALLOWED_AUDIOTYPES,
        });
      }
    }
    if (fecha) {
      const d = new Date(String(fecha));
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "fecha inválida, use YYYY-MM-DD" });
      }
    }
    if (cinemaId && isNaN(Number(cinemaId))) {
      return res.status(400).json({ error: "cinemaId inválido" });
    }
    if (roomId && isNaN(Number(roomId))) {
      return res.status(400).json({ error: "roomId inválido" });
    }

    const filters: ShowtimeFilterDto = {
      format: format ? String(format).trim() : undefined,
      language: language ? String(language).trim() : undefined,
      audioType: audioType ? String(audioType).trim() : undefined,
      fecha: fecha ? String(fecha).trim() : undefined,
      cinemaId: cinemaId ? Number(cinemaId) : undefined,
      roomId: roomId ? Number(roomId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    // P1-11: validación paginación
    if (filters.page !== undefined && (isNaN(filters.page) || filters.page < 1)) {
      return res.status(400).json({ error: "page debe ser un entero >= 1" });
    }
    if (filters.limit !== undefined && (isNaN(filters.limit) || filters.limit < 1 || filters.limit > 50)) {
      return res.status(400).json({ error: "limit debe ser un entero entre 1 y 50" });
    }

    // P1-11 / P0-6: respuesta paginada {data, total, page, totalPages} con availableSeats real
    const paginated = await showtimeService.getShowtimesForMoviePaginated(movieId, filters);
    return res.status(200).json(paginated);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

export const getShowtimePrices = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const membershipLevel = Number(req.query.membershipLevel) || 1;
    const prices = await showtimeService.getShowtimePrices(id, membershipLevel);
    return res.status(200).json(prices);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

