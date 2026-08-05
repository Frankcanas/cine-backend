// app/src/routes/movie.routes.ts

import { Router } from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getPopularFromTmdb,
  searchTmdbMovies,
  syncMovieWithTmdb,
} from "../controllers/movie.controller";

const router = Router();

/**
 * @swagger
 * /api/movies/tmdb/popular:
 *   get:
 *     summary: Obtener películas populares directamente desde TMDB
 *     tags: [Movies - TMDB]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de películas populares obtenida de TMDB
 */
router.get("/tmdb/popular", getPopularFromTmdb);

/**
 * @swagger
 * /api/movies/tmdb/search:
 *   get:
 *     summary: Buscar películas en TMDB por título
 *     tags: [Movies - TMDB]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda en TMDB
 */
router.get("/tmdb/search", searchTmdbMovies);

/**
 * @swagger
 * /api/movies/tmdb/sync/{tmdbId}:
 *   post:
 *     summary: Sincronizar e importar una película de TMDB a la base de datos local
 *     tags: [Movies - TMDB]
 *     parameters:
 *       - in: path
 *         name: tmdbId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película en TMDB
 *     responses:
 *       201:
 *         description: Película importada/sincronizada correctamente en la BD local
 */
router.post("/tmdb/sync/:tmdbId", syncMovieWithTmdb);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtener todas las películas locales
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de películas locales
 */
router.get("/", getMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Obtener una película por ID local
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la película
 *       404:
 *         description: Película no encontrada
 */
router.get("/:id", getMovieById);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crear una película manualmente en la BD local
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               synopsis:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 */
router.post("/", createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Actualizar datos de una película local
 *     tags: [Movies]
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
 *         description: Película actualizada
 */
router.put("/:id", updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Eliminar una película local
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Película eliminada
 */
router.delete("/:id", deleteMovie);

export default router;
