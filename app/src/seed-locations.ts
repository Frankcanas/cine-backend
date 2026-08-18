// FCB - Archivo creado
import sequelize from "./config/database";
import Country from "./models/country.model";
import City from "./models/city.model";

async function seed() {
  try {
    await sequelize.authenticate();
    
    // Drop existing tables to avoid constraint issues with new schema
    await sequelize.query('DROP TABLE IF EXISTS cities CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS countries CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS departments CASCADE');

    // Sync models
    await sequelize.sync({ alter: true });

    // Seed Countries
    const [colombia] = await Country.findOrCreate({ where: { name: "Colombia" } });
    const [panama] = await Country.findOrCreate({ where: { name: "Panamá" } });

    // Seed Cities - Colombia
    const colombiaCities = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];
    for (const cityName of colombiaCities) {
      await City.findOrCreate({
        where: { name: cityName, countryId: colombia.id }
      });
    }

    // Seed Cities - Panama
    const panamaCities = ["Ciudad de Panamá", "David"];
    for (const cityName of panamaCities) {
      await City.findOrCreate({
        where: { name: cityName, countryId: panama.id }
      });
    }

    console.log("Locations seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exit(1);
  }
}

seed();
