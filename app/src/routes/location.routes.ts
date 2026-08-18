// FCB - Archivo creado
// app/src/routes/location.routes.ts

import { Router } from "express";
import { LocationController } from "../controllers/location.controller";

const router = Router();
const controller = new LocationController();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Endpoints para consultar países, departamentos y ciudades
 */

/**
 * @swagger
 * /api/locations/countries:
 *   get:
 *     summary: Obtener todos los países
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Lista de países
 */
router.get("/countries", controller.getCountries.bind(controller));

/**
 * @swagger
 * /api/locations/countries/{countryId}/cities:
 *   get:
 *     summary: Obtener ciudades por país
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de ciudades
 */
router.get("/countries/:countryId/cities", controller.getCitiesByCountry.bind(controller));

export default router;
