import Country from "../models/country.model";
import City from "../models/city.model";
import Cinema from "../models/cinema.model";

export class LocationRepository {
  async findAllCountries(): Promise<Country[]> {
    return await Country.findAll({ order: [["name", "ASC"]] });
  }

  async findCitiesByCountryId(countryId: number, onlyActive: boolean = true): Promise<City[]> {
    const where: any = { countryId };
    if (onlyActive) {
      where.isActive = true;
    }
    return await City.findAll({
      where,
      include: [{ model: Cinema }],
      order: [["name", "ASC"]],
    });
  }

  async findCityById(id: number): Promise<City | null> {
    return await City.findByPk(id, { include: [{ model: Cinema }] });
  }
}
