// app/src/controllers/movie.controller.ts

import { Request, Response } from "express";
import { MovieService } from "../services/movie.service";
import { TMDBService } from "../services/tmdb.service";

const movieService = new MovieService();
const tmdbService = new TMDBService();

export const getMovies = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, genreId } = req.query;
    const movies = await movieService.getMovies({
      title: title ? String(title) : undefined,
      genreId: genreId ? Number(genreId) : undefined,
    });
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
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
    const movies = await tmdbService.getPopularMovies(page);
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const searchTmdbMovies = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = String(req.query.query || "");
    const page = Number(req.query.page) || 1;
    if (!query) {
      return res.status(400).json({ error: "El parámetro de búsqueda 'query' es requerido" });
    }
    const movies = await tmdbService.searchMovies(query, page);
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
