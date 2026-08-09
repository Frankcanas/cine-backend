// app/src/routes/movie.routes.ts

import { Router } from "express";
import {
  getMovies,
  getWeeklyMovies,
  getTodayMovies,
  filterMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getPopularFromTmdb,
  getUpcomingFromTmdb,
  getTopRatedFromTmdb,
  searchTmdbMovies,
  syncMovieWithTmdb,
  syncGenresFromTmdb,
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
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de películas populares obtenida de TMDB
 */
router.get("/tmdb/popular", getPopularFromTmdb);

/**
 * @swagger
 * /api/movies/tmdb/upcoming:
 *   get:
 *     summary: Obtener próximos estrenos desde TMDB
 *     tags: [Movies - TMDB]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de próximos estrenos obtenida de TMDB
 */
router.get("/tmdb/upcoming", getUpcomingFromTmdb);

/**
 * @swagger
 * /api/movies/tmdb/top-rated:
 *   get:
 *     summary: Obtener películas mejor valoradas desde TMDB
 *     tags: [Movies - TMDB]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Películas mejor valoradas
 */
router.get("/tmdb/top-rated", getTopRatedFromTmdb);

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
 * /api/movies/tmdb/sync-genres:
 *   post:
 *     summary: Sincronizar el catálogo de géneros desde TMDB a la base de datos local
 *     tags: [Movies - TMDB]
 *     responses:
 *       200:
 *         description: Géneros sincronizados exitosamente
 */
router.post("/tmdb/sync-genres", syncGenresFromTmdb);

/**
 * @swagger
 * /api/movies/tmdb/sync/{tmdbId}:
 *   post:
 *     summary: Sincronizar e importar una película y sus géneros de TMDB a la BD local
 *     tags: [Movies - TMDB]
 *     parameters:
 *       - in: path
 *         name: tmdbId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Película importada/sincronizada correctamente en la BD local
 */
router.post("/tmdb/sync/:tmdbId", syncMovieWithTmdb);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtener todas las películas locales (incluyendo géneros, funciones y estrenos)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de películas locales
 */
router.get("/", getMovies);

/**
 * @swagger
 * /api/movies/weekly:
 *   get:
 *     summary: Obtener la cartelera semanal
 *     description: >
 *       Retorna las películas activas que tienen funciones disponibles
 *       desde el momento actual hasta los próximos siete días.
 *       Permite aplicar filtros opcionales por título, ciudad, género,
 *       clasificación, idioma, tipo de sala, formato, complejo y disponibilidad.
 *     tags:
 *       - Billboard
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Título o parte del título de la película.
 *         example: Superman
 *
 *       - in: query
 *         name: city
 *         required: false
 *         schema:
 *           type: string
 *         description: Ciudad donde se encuentran los complejos.
 *         example: Medellín
 *
 *       - in: query
 *         name: genreId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador local del género.
 *         example: 28
 *
 *       - in: query
 *         name: classification
 *         required: false
 *         schema:
 *           type: string
 *         description: Clasificación de la película.
 *         example: PG-13
 *
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Idioma disponible para la función.
 *         example: Español
 *
 *       - in: query
 *         name: roomType
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de sala.
 *         example: VIP
 *
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *         description: Formato de proyección disponible.
 *         example: 2D
 *
 *       - in: query
 *         name: cinemaId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del complejo de cine.
 *         example: 1
 *
 *       - in: query
 *         name: available
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Si es true, únicamente retorna funciones que tengan
 *           asientos disponibles.
 *         example: true
 *
 *     responses:
 *       200:
 *         description: Cartelera semanal consultada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: weekly
 *                 from:
 *                   type: string
 *                   format: date-time
 *                 to:
 *                   type: string
 *                   format: date-time
 *                 totalMovies:
 *                   type: integer
 *                   example: 3
 *                 message:
 *                   type: string
 *                   nullable: true
 *                   example: No existen funciones activas para los filtros seleccionados.
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get("/weekly", getWeeklyMovies);

/**
 * @swagger
 * /api/movies/today:
 *   get:
 *     summary: Obtener la cartelera del día
 *     description: >
 *       Retorna las películas activas que tienen funciones pendientes
 *       desde el momento actual hasta finalizar el día.
 *       Permite aplicar filtros opcionales sobre la cartelera.
 *     tags:
 *       - Billboard
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Título o parte del título de la película.
 *         example: Superman
 *
 *       - in: query
 *         name: city
 *         required: false
 *         schema:
 *           type: string
 *         description: Ciudad donde se encuentran los complejos.
 *         example: Medellín
 *
 *       - in: query
 *         name: genreId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del género.
 *         example: 28
 *
 *       - in: query
 *         name: classification
 *         required: false
 *         schema:
 *           type: string
 *         description: Clasificación de la película.
 *         example: PG-13
 *
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Idioma de la función.
 *         example: Español
 *
 *       - in: query
 *         name: roomType
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de sala.
 *         example: VIP
 *
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *         description: Formato de proyección.
 *         example: 2D
 *
 *       - in: query
 *         name: cinemaId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del complejo.
 *         example: 1
 *
 *       - in: query
 *         name: available
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Si es true, excluye las funciones que no tengan
 *           asientos disponibles.
 *         example: true
 *
 *     responses:
 *       200:
 *         description: Cartelera del día consultada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: today
 *                 from:
 *                   type: string
 *                   format: date-time
 *                 to:
 *                   type: string
 *                   format: date-time
 *                 totalMovies:
 *                   type: integer
 *                   example: 2
 *                 message:
 *                   type: string
 *                   nullable: true
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/today", getTodayMovies);

/**
 * @swagger
 * /api/movies/filter:
 *   get:
 *     summary: Filtrar la cartelera
 *     description: >
 *       Permite consultar la cartelera utilizando uno o varios filtros.
 *       Si se envía una fecha, retorna las funciones correspondientes
 *       a ese día. Si no se envía una fecha, consulta los próximos siete días.
 *     tags:
 *       - Billboard
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha que se desea consultar en formato YYYY-MM-DD.
 *         example: 2026-08-10
 *
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Título o parte del título de la película.
 *         example: Superman
 *
 *       - in: query
 *         name: city
 *         required: false
 *         schema:
 *           type: string
 *         description: Ciudad de la cartelera.
 *         example: Medellín
 *
 *       - in: query
 *         name: genreId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del género.
 *         example: 28
 *
 *       - in: query
 *         name: classification
 *         required: false
 *         schema:
 *           type: string
 *         description: Clasificación de la película.
 *         example: PG-13
 *
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Idioma de la función.
 *         example: Español
 *
 *       - in: query
 *         name: roomType
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de sala.
 *         example: VIP
 *
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *         description: Formato de proyección.
 *         example: 3D
 *
 *       - in: query
 *         name: cinemaId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del complejo de cine.
 *         example: 2
 *
 *       - in: query
 *         name: available
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Si es true, excluye las funciones que tengan cero
 *           asientos disponibles.
 *         example: true
 *
 *     responses:
 *       200:
 *         description: Cartelera filtrada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: filtered
 *                 from:
 *                   type: string
 *                   format: date-time
 *                 to:
 *                   type: string
 *                   format: date-time
 *                 totalMovies:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   nullable: true
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Alguno de los filtros enviados es inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La fecha proporcionada no es válida
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/filter", filterMovies);


/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Obtener una película por ID local con sus asociaciones
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
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: integer
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
