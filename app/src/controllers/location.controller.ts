// app/src/controllers/location.controller.ts

import { Request, Response } from "express";
import { LocationService } from "../services/location.service";

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  getCountries = async (req: Request, res: Response): Promise<void> => {
    try {
      const countries = await this.locationService.getCountries();
      res.status(200).json(countries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al obtener países" });
    }
  };

  getCitiesByCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const countryId = Number(req.params.countryId);
      const cities = await this.locationService.getCitiesByCountry(countryId);
      res.status(200).json(cities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al obtener ciudades" });
    }
  };

  setUserLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number((req as any).userId || req.body.userId);
      const { city } = req.body;

      if (!userId || !city) {
        res.status(400).json({ error: "userId y city son requeridos" });
        return;
      }

      const result = await this.locationService.setUserLocation(userId, city);
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message });
    }
  };
}
