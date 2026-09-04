// app/src/routes/health.routes.ts

import { Router, Request, Response } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Verificar el estado de salud de la API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: El servicio está operando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 */
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
