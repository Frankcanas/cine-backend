// app/src/seed-memberships.ts - Seed 4 niveles HU-008 RN-032
import sequelize from "./config/database";
import Membership from "./models/membreship.model";

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const levels = [
    { name: "Clásica", level: "Bronce", price: 0, durationDays: 365, description: "Membresía inicial Bronce: descuentos básicos 5% y acumulación 1x puntos.", discountPercentage: 5, pointsPerPurchase: 10 },
    { name: "Plata", level: "Plata", price: 30000, durationDays: 365, description: "Nivel Plata: 10% descuento en entradas y confitería, acumulación 1.2x.", discountPercentage: 10, pointsPerPurchase: 12 },
    { name: "Oro", level: "Oro", price: 60000, durationDays: 365, description: "Nivel Oro: 15% descuento, prioridad reservas, 1.5x puntos.", discountPercentage: 15, pointsPerPurchase: 15 },
    { name: "Platino", level: "Platino", price: 100000, durationDays: 365, description: "Nivel Platino: 25% descuento total, acceso premiun y 2x puntos.", discountPercentage: 25, pointsPerPurchase: 20 },
  ];

  for (const m of levels) {
    const [mem, created] = await Membership.findOrCreate({
      where: { name: m.name },
      defaults: m as any,
    });
    if (!created) {
      await mem.update({ level: m.level, discountPercentage: m.discountPercentage, pointsPerPurchase: m.pointsPerPurchase, description: m.description, price: m.price, durationDays: m.durationDays });
      console.log(`Updated ${m.name}`);
    } else {
      console.log(`Created ${m.name}`);
    }
  }
  console.log("Seed memberships done");
  await sequelize.close();
}

seed().catch((e) => { console.error(e); process.exit(1); });
