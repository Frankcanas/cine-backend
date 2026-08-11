// app/src/routes/movie-release.routes.ts

import { Router } from "express";
import {
  createMovieRelease,
  getMovieReleases,
  getMovieReleaseById,
  updateMovieRelease,
  deleteMovieRelease,
} from "../controllers/movie-release.controller";

const router = Router();

/**
 * @swagger
 * /api/releases:
 *   get:
 *     summary: Obtener la lista de estrenos de películas
 *     tags: [MovieReleases]
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de estrenos
 */
router.get("/", getMovieReleases);

/**
 * @swagger
 * /api/releases/{id}:
 *   get:
 *     summary: Obtener un estreno por ID
 *     tags: [MovieReleases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del estreno
 *       404:
 *         description: Estreno no encontrado
 */
router.get("/:id", getMovieReleaseById);

/**
 * @swagger
 * /api/releases:
 *   post:
 *     summary: Registrar una fecha de estreno para una película
 *     tags: [MovieReleases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - releaseDate
 *             properties:
 *               movieId:
 *                 type: integer
 *               releaseDate:
 *                 type: string
 *               region:
 *                 type: string
 *               releaseType:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estreno registrado exitosamente
 */
router.post("/", createMovieRelease);

/**
 * @swagger
 * /api/releases/{id}:
 *   put:
 *     summary: Actualizar información de un estreno
 *     tags: [MovieReleases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Estreno actualizado
 */
router.put("/:id", updateMovieRelease);

/**
 * @swagger
 * /api/releases/{id}:
 *   delete:
 *     summary: Eliminar un estreno
 *     tags: [MovieReleases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estreno eliminado
 */
router.delete("/:id", deleteMovieRelease);

export default router;
