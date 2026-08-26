// app/src/services/location.service.ts

import { LocationRepository } from "../repositories/location.repository";
import Country from "../models/country.model";
import City from "../models/city.model";
import userRepository from "../repositories/user.repository";

export class LocationService {
  private repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  async getCountries(): Promise<Country[]> {
    return await this.repository.findAllCountries();
  }

  async getCitiesByCountry(countryId: number): Promise<City[]> {
    return await this.repository.findCitiesByCountryId(countryId, true);
  }

  async setUserLocation(userId: number, cityName: string): Promise<{ success: boolean; city: string }> {
    const user = await userRepository.findByid(userId);
    if (!user) {
      const error: any = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    user.city = cityName;
    await user.save();

    return {
      success: true,
      city: cityName,
    };
  }
}
