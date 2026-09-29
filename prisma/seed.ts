import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.tradeConfirmation.deleteMany();
  await prisma.tradeBid.deleteMany();
  await prisma.tradeOffer.deleteMany();
  await prisma.userCard.deleteMany();
  await prisma.pack.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user (Gary - the creator)
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      username: "Gary",
      email: "gary@meroverse.com",
      password: adminPassword,
      melocoins: 9999,
      isAdmin: true,
    },
  });

  // ============================================================
  // CARDS - Collection: BLACK_VS_WHITE
  // ============================================================
  const cards = [
    // === COMMUNS ===
    {
      number: 1,
      name: "Victor",
      character: "Victor",
      race: "BLANC",
      planet: "LA_LOUVIERE",
      rarity: "COMMUN",
      collection: "BLACK_VS_WHITE",
      description: "L'un des deux mortels les plus puissants de La Louvière.",
    },
    {
      number: 2,
      name: "Nathan",
      character: "Nathan",
      race: "NOIR",
      planet: "LA_LOUVIERE",
      rarity: "COMMUN",
      collection: "BLACK_VS_WHITE",
      description: "L'un des deux mortels les plus puissants de La Louvière.",
    },
    {
      number: 3,
      name: "Hadrien",
      character: "Hadrien",
      race: "BLANC",
      planet: "LA_LOUVIERE",
      rarity: "COMMUN",
      collection: "BLACK_VS_WHITE",
      description: "Le frère de Victor, largement supérieur à Nathan et Victor.",
    },
    {
      number: 4,
      name: "Tory",
      character: "Tory",
      race: "BLANC",
      planet: "FEMME",
      rarity: "COMMUN",
      collection: "BLACK_VS_WHITE",
      description: "Venue de la planète Femme, elle mit fin à la SkateApocalypse.",
    },
    {
      number: 5,
      name: "Homero",
      character: "Homero",
      race: "MEXICAIN",
      planet: "LA_LOUVIERE",
      rarity: "COMMUN",
      collection: "BLACK_VS_WHITE",
      description: "Grand frère de Gary. De nature faible, mais porteur d'un grand potentiel.",
    },
    // === RARES ===
    {
      number: 6,
      name: "Black Iov",
      character: "Black Iov",
      race: "NOIR",
      planet: "LA_LOUVIERE",
      rarity: "RARE",
      collection: "BLACK_VS_WHITE",
      description: "Le frère de Nathan. Sa puissance surpasse celle de tous les mortels.",
    },
    {
      number: 7,
      name: "Damian",
      character: "Damian",
      race: "MEXICAIN",
      planet: "LA_LOUVIERE",
      rarity: "RARE",
      collection: "BLACK_VS_WHITE",
      description: "Grand frère de Gary. Il vint défendre son frère face aux forces du chaos.",
    },
    // === EPIQUES ===
    {
      number: 8,
      name: "Victhor",
      character: "Victor",
      race: "BLANC",
      planet: "LA_LOUVIERE",
      rarity: "EPIQUE",
      collection: "BLACK_VS_WHITE",
      description: "La transformation de Victor. Une puissance divine inspirée de Thor.",
    },
    {
      number: 9,
      name: "Natho",
      character: "Nathan",
      race: "NOIR",
      planet: "LA_LOUVIERE",
      rarity: "EPIQUE",
      collection: "BLACK_VS_WHITE",
      description: "La transformation de Nathan. Une puissance divine inspirée de Thor.",
    },
    {
      number: 10,
      name: "Damialien",
      character: "Damian",
      race: "MEXICAIN",
      planet: "LA_LOUVIERE",
      rarity: "EPIQUE",
      collection: "BLACK_VS_WHITE",
      description: "La forme transformée de Damian. Il affronta Ginza et Black Iov.",
    },
    // === MYTHIQUES ===
    {
      number: 11,
      name: "VicBlack",
      character: "Victor & Nathan",
      race: "BLANC",
      planet: "LA_LOUVIERE",
      rarity: "MYTHIQUE",
      collection: "BLACK_VS_WHITE",
      description: "La fusion de Victhor et Natho. Né de la rage contre Gary.",
    },
    {
      number: 12,
      name: "Black Iov Forme Suprême",
      character: "Black Iov",
      race: "NOIR",
      planet: "LA_LOUVIERE",
      rarity: "MYTHIQUE",
      collection: "BLACK_VS_WHITE",
      description: "Après un entraînement acharné, Black Iov atteignit une forme de vie supérieure.",
    },
    {
      number: 13,
      name: "Grabby22",
      character: "Victor",
      race: "BLANC",
      planet: "LA_LOUVIERE",
      rarity: "MYTHIQUE",
      collection: "BLACK_VS_WHITE",
      description: "La forme ultime de Victor. Une blancheur absolue qui écrasa Black Iov.",
    },
    {
      number: 14,
      name: "Homero x Gary",
      character: "Homero",
      race: "MEXICAIN",
      planet: "LA_LOUVIERE",
      rarity: "MYTHIQUE",
      collection: "BLACK_VS_WHITE",
      description: "Homero canalisait la force de Gary pour exterminer les forces du chaos.",
    },
    // === LEGENDAIRES (isSecret = true) ===
    {
      number: 15,
      name: "Gary",
      character: "Gary",
      race: "MEXICAIN",
      planet: "LA_LOUVIERE",
      rarity: "LEGENDAIRE",
      collection: "BLACK_VS_WHITE",
      description: "Le dieu créateur de l'univers. Maître des 11 Boules de Gary.",
      isSecret: true,
    },
    {
      number: 16,
      name: "Ginza",
      character: "Ginza",
      race: "NOIR",
      planet: "LA_LOUVIERE",
      rarity: "LEGENDAIRE",
      collection: "BLACK_VS_WHITE",
      description: "La déesse du chaos. Championne de la guerre des Noirs contre les Blancs.",
      isSecret: true,
    },
    // === CHROMATIQUES (isSecret = true) ===
    {
      number: 17,
      name: "Black Iov Résurrection",
      character: "Black Iov",
      race: "NOIR",
      planet: "LA_LOUVIERE",
      rarity: "CHROMATIQUE",
      collection: "BLACK_VS_WHITE",
      description: "Variante : Le moment où Black Iov fut ressuscité par les 11 Boules de Gary.",
      isSecret: true,
    },
    {
      number: 18,
      name: "VicBlack Fusion",
      character: "Victor & Nathan",
      race: "BLANC",
      planet: "LA_LOUVIERE",
      rarity: "CHROMATIQUE",
      collection: "BLACK_VS_WHITE",
      description: "Variante chromatique : L'instant de la fusion légendaire entre Victhor et Natho.",
      isSecret: true,
    },
    {
      number: 19,
      name: "Gary Chaos",
      character: "Gary",
      race: "MEXICAIN",
      planet: "LA_LOUVIERE",
      rarity: "CHROMATIQUE",
      collection: "BLACK_VS_WHITE",
      description: "Variante : Gary sous l'emprise du chaos déchaîné par les Noirs.",
      isSecret: true,
    },
  ];

  for (const card of cards) {
    await prisma.card.create({ data: card });
  }

  // ============================================================
  // PACKS
  // ============================================================
  await prisma.pack.create({
    data: {
      name: "Booster Black vs White",
      collection: "BLACK_VS_WHITE",
      price: 50,
      cardsCount: 5,
      isAvailable: true,
      description: "Le premier booster du Meroverse. Contient 5 cartes de la collection Black vs White.",
    },
  });

  await prisma.pack.create({
    data: {
      name: "Méga Booster Black vs White",
      collection: "BLACK_VS_WHITE",
      price: 120,
      cardsCount: 10,
      isAvailable: true,
      description: "Un booster de 10 cartes avec un taux de rareté amélioré.",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${cards.length} cartes créées`);
  console.log("   - 2 boosters créés");
  console.log("   - 1 utilisateur admin (Gary) créé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
