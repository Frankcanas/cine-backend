// ruta_avanzada/proyecto_incremental/app/src/index.ts

/**
 * Es el entrypoint real de la aplicación.
 * Se encarga de:
 * - Levantar la base de datos (sequelize.authenticate + sequelize.sync).
 * - Arrancar el servidor (app.listen).
 * - Es el que realmente ejecutas cuando corres npm run dev o docker-compose up.
 */
import dotenv from 'dotenv';
dotenv.config(); 

import app from "./server";
import sequelize from "./config/database";
import { Op } from "sequelize";
import SeatLock from "./models/seat-lock.model";

const PORT = process.env.APP_PORT || 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la BD establecida...");

    await sequelize.sync(
      {
         alter: true,
      }
    );

    // Limpieza periódica de bloqueos expirados (HU-010 P0-5): cada 60s borra SeatLock con expiresAt <= now().
    // En producción se recomienda evolucionar a node-cron, pg_cron o BullMQ+Redis.
    setInterval(async () => {
      try {
        await SeatLock.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });
      } catch (e) {
        console.error("[seat-lock-cleanup] Error:", e);
      }
    }, 60_000).unref?.();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la BD :", error);
    process.exit(1);
  }
};

start();