// app/src/controllers/movie-release.controller.ts

import { Request, Response } from "express";
import { MovieReleaseService } from "../services/movie-release.service";

const service = new MovieReleaseService();

export const createMovieRelease = async (req: Request, res: Response): Promise<Response> => {
  try {
    const release = await service.create(req.body);
    return res.status(201).json(release);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMovieReleases = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { movieId } = req.query;
    if (movieId) {
      const releases = await service.getByMovieId(Number(movieId));
      return res.status(200).json(releases);
    }
    const releases = await service.getAll();
    return res.status(200).json(releases);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMovieReleaseById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const release = await service.getById(id);
    if (!release) {
      return res.status(404).json({ error: "Estreno no encontrado" });
    }
    return res.status(200).json(release);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateMovieRelease = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const release = await service.update(id, req.body);
    if (!release) {
      return res.status(404).json({ error: "Estreno no encontrado" });
    }
    return res.status(200).json(release);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMovieRelease = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Estreno no encontrado" });
    }
    return res.status(200).json({ message: "Estreno eliminado correctamente" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
