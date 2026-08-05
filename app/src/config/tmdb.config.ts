// app/src/config/tmdb.config.ts
import dotenv from "dotenv";
dotenv.config();

/**
 * Configuración para la API de TMDB (The Movie Database)
 */
export const tmdbConfig = {
  baseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  apiKey: process.env.TMDB_API_KEY || "",
  accessToken: process.env.TMDB_ACCESS_TOKEN || "",
  imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500",
};
