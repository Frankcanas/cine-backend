// FCB - Archivo creado
// app/src/controllers/location.controller.ts

import { Request, Response } from "express";
import Country from "../models/country.model";
import City from "../models/city.model";

export class LocationController {
  async getCountries(req: Request, res: Response): Promise<void> {
    try {
      const countries = await Country.findAll({ order: [["name", "ASC"]] });
      res.status(200).json(countries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al obtener países" });
    }
  }

  async getCitiesByCountry(req: Request, res: Response): Promise<void> {
    try {
      const { countryId } = req.params;
      const cities = await City.findAll({
        where: { countryId },
        order: [["name", "ASC"]],
      });
      res.status(200).json(cities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al obtener ciudades" });
    }
  }
}
