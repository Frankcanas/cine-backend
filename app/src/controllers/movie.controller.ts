// app/src/controllers/movie.controller.ts

import { Request, Response } from "express";
import { MovieService } from "../services/movie.service";
import { TMDBService } from "../services/tmdb.service";
import { BillboardFilterDto } from "../dto/billboard-filter.dto";

const movieService = new MovieService();
const tmdbService = new TMDBService();

const getBillboardFilters = (
  req: Request
): BillboardFilterDto => {
  const availableQuery = req.query.available;

  return {
    title: req.query.title
      ? String(req.query.title)
      : undefined,

    date: req.query.date
      ? String(req.query.date)
      : undefined,

    genreId: req.query.genreId
      ? Number(req.query.genreId)
      : undefined,

    classification: req.query.classification
      ? String(req.query.classification)
      : undefined,

    language: req.query.language
      ? String(req.query.language)
      : undefined,

    roomType: req.query.roomType
      ? String(req.query.roomType)
      : undefined,

    format: req.query.format
      ? String(req.query.format)
      : undefined,

    cinemaId: req.query.cinemaId
      ? Number(req.query.cinemaId)
      : undefined,

    city: req.query.city
      ? String(req.query.city)
      : undefined,

    available:
      availableQuery === undefined
        ? undefined
        : String(availableQuery).toLowerCase() === "true",
  };
};

export const getMovies = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, genreId, status } = req.query;
    const movies = await movieService.getMovies({
      title: title ? String(title) : undefined,
      genreId: genreId ? Number(genreId) : undefined,
      status: status ? String(status) : undefined,
    });
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getWeeklyMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const filters = getBillboardFilters(req);

    const result =
      await movieService.getWeeklyBillboard(
        filters
      );

    return res.status(200).json(result);

  } catch (error: any) {

    return res.status(500).json({
      error: error.message,
    });
  }
};
export const getTodayMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const filters = getBillboardFilters(req);

    const result =
      await movieService.getTodayBillboard(
        filters
      );

    return res.status(200).json(result);

  } catch (error: any) {

    return res.status(500).json({
      error: error.message,
    });
  }
};
export const filterMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const filters = getBillboardFilters(req);

    const result =
      await movieService.getFilteredBillboard(
        filters
      );

    return res.status(200).json(result);

  } catch (error: any) {

    const isDateError =
      error.message.includes("fecha");

    return res
      .status(isDateError ? 400 : 500)
      .json({
        error: error.message,
      });
  }
};
export const getMovieById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    return res.status(200).json(movie);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMovieFunctions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const functions = await movieService.getMovieFunctions(id);
    return res.status(200).json(functions);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMovieRecommendations = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const recommendations = await movieService.getMovieRecommendations(id);
    return res.status(200).json(recommendations);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createMovie = async (req: Request, res: Response): Promise<Response> => {
  try {
    const movie = await movieService.createMovie(req.body);
    return res.status(201).json(movie);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateMovie = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const movie = await movieService.updateMovie(id, req.body);
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    return res.status(200).json(movie);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const deleted = await movieService.deleteMovie(id);
    if (!deleted) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    return res.status(200).json({ message: "Película eliminada correctamente" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPopularFromTmdb = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const language = String(req.query.language || "es-ES");
    const movies = await tmdbService.getPopularMovies(page, language);
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUpcomingFromTmdb = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const language = String(req.query.language || "es-ES");
    const movies = await tmdbService.getUpcomingMovies(page, language);
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTopRatedFromTmdb = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const language = String(req.query.language || "es-ES");
    const movies = await tmdbService.getTopRatedMovies(page, language);
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const searchTmdbMovies = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = String(req.query.query || "");
    const page = Number(req.query.page) || 1;
    const language = String(req.query.language || "es-ES");
    if (!query) {
      return res.status(400).json({ error: "El parámetro de búsqueda 'query' es requerido" });
    }
    const movies = await tmdbService.searchMovies(query, page, language);
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const syncMovieWithTmdb = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tmdbId = Number(req.params.tmdbId);
    const movie = await movieService.syncWithTmdb(tmdbId);
    return res.status(201).json(movie);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const syncGenresFromTmdb = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const genres = await movieService.syncGenresFromTmdb();
    return res.status(200).json({ message: "Géneros sincronizados correctamente", genres });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
