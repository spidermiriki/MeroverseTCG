import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const BLACK_VS_WHITE_CARDS = [
  // Regular cards (1-32), totalCards = 32
  { number: 1,  name: "Hadrien",               character: "Hadrien",               race: "NOIR",     planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 2,  name: "Iovan",                 character: "Iovan",                 race: "BLANC",    planet: "LA_LOUVIERE", rarity: "EPIQUE",      isSecret: false },
  { number: 3,  name: "Damian",                character: "Damian",                race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 4,  name: "Damialien",             character: "Damialien",             race: "BLANC",    planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 5,  name: "Victor",                character: "Victor",                race: "BLANC",    planet: "LA_LOUVIERE", rarity: "RARE",        isSecret: false },
  { number: 6,  name: "Victhor",               character: "Victhor",               race: "BLANC",    planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 7,  name: "Nathane",               character: "Nathane",               race: "BLANC",    planet: "LA_LOUVIERE", rarity: "RARE",        isSecret: false },
  { number: 8,  name: "Nathor",                character: "Nathor",                race: "BLANC",    planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 9,  name: "Andrea",                character: "Andrea",                race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 10, name: "Jarno",                 character: "Jarno",                 race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 11, name: "J-train",               character: "J-train",               race: "ZOULOU",   planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 12, name: "Jonas",                 character: "Jonas",                 race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 13, name: "Josh",                  character: "Josh",                  race: "ZOULOU",   planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 14, name: "Ahmed",                 character: "Ahmed",                 race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "RARE",        isSecret: false },
  { number: 15, name: "Uriel",                 character: "Uriel",                 race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "RARE",        isSecret: false },
  { number: 16, name: "Ouriel",                character: "Ouriel",                race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "EPIQUE",      isSecret: false },
  { number: 17, name: "Ouriel Vibracran",      character: "Ouriel Vibracran",      race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 18, name: "James",                 character: "James",                 race: "ZOULOU",   planet: "LA_LOUVIERE", rarity: "RARE",        isSecret: false },
  { number: 19, name: "Flo",                   character: "Flo",                   race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 20, name: "Tory",                  character: "Tory",                  race: "BLANC",    planet: "LA_LOUVIERE", rarity: "EPIQUE",      isSecret: false },
  { number: 21, name: "Kyky",                  character: "Kyky",                  race: "ZOULOU",   planet: "LA_LOUVIERE", rarity: "RARE",        isSecret: false },
  { number: 22, name: "Julien",                character: "Julien",                race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 23, name: "Bastian",               character: "Bastian",               race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 24, name: "Bastien",               character: "Bastien",               race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 25, name: "Sacha",                 character: "Sacha",                 race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 26, name: "Noah",                  character: "Noah",                  race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 27, name: "Mirko",                 character: "Mirko",                 race: "BLANC",    planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 28, name: "Dario le King",         character: "Dario le King",         race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "MYTHIQUE",    isSecret: false },
  { number: 29, name: "Homero",                character: "Homero",                race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 30, name: "Gabi",                  character: "Gabi",                  race: "BLANC",    planet: "FEMME",       rarity: "RARE",        isSecret: false },
  { number: 31, name: "Gary dans le panier",   character: "Gary dans le panier",   race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  { number: 32, name: "Ginsa dans le panier",  character: "Ginsa dans le panier",  race: "BLANC",    planet: "LA_LOUVIERE", rarity: "COMMUN",      isSecret: false },
  // Secret / Legendary cards (33-45), totalCards = 45
  { number: 33, name: "Grabby22",                          character: "Grabby22",                          race: "ZOULOU",   planet: "LA_LOUVIERE", rarity: "LEGENDAIRE",  isSecret: true },
  { number: 34, name: "Vicblack",                          character: "Vicblack",                          race: "BLANC",    planet: "LA_LOUVIERE", rarity: "LEGENDAIRE",  isSecret: true },
  { number: 35, name: "Black Iov",                         character: "Black Iov",                         race: "BLANC",    planet: "LA_LOUVIERE", rarity: "LEGENDAIRE",  isSecret: true },
  { number: 36, name: "Ginza",                             character: "Ginza",                             race: "BLANC",    planet: "LA_LOUVIERE", rarity: "LEGENDAIRE",  isSecret: true },
  { number: 37, name: "Gary",                              character: "Gary",                              race: "BLANC",    planet: "LA_LOUVIERE", rarity: "LEGENDAIRE",  isSecret: true },
  { number: 38, name: "Tunay",                             character: "Tunay",                             race: "BLANC",    planet: "LA_LOUVIERE", rarity: "RAINBOW",     isSecret: true },
  { number: 39, name: "Black Iov Résurrection",            character: "Black Iov Résurrection",            race: "BLANC",    planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
  { number: 40, name: "« Ne jamais faire confiance à un noir »", character: "Ne jamais faire confiance à un noir", race: "NOIR", planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
  { number: 41, name: "Homero X Gawy",                    character: "Homero X Gawy",                     race: "MEXICAIN", planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
  { number: 42, name: "Black Iov vs Grabby22",             character: "Black Iov vs Grabby22",             race: "BLANC",    planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
  { number: 43, name: "J-train vs Mirko",                  character: "J-train vs Mirko",                  race: "ZOULOU",   planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
  { number: 44, name: "Black Iov vs Hadrien",              character: "Black Iov vs Hadrien",              race: "BLANC",    planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
  { number: 45, name: "SkateApocalypse",                   character: "SkateApocalypse",                   race: "BLANC",    planet: "LA_LOUVIERE", rarity: "CHROMATIQUE", isSecret: true },
] as const;

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const COLLECTION = "BLACK_VS_WHITE";

    // 1. Récupérer toutes les cartes existantes de la collection
    const existingCards = await prisma.card.findMany({
      where: { collection: COLLECTION },
      select: { id: true },
    });
    const existingIds = existingCards.map((c) => c.id);

    // 2. Supprimer les UserCards liés à ces cartes
    if (existingIds.length > 0) {
      await prisma.userCard.deleteMany({
        where: { cardId: { in: existingIds } },
      });
      await prisma.card.deleteMany({
        where: { collection: COLLECTION },
      });
    }

    // 3. Recréer toutes les cartes dans le bon ordre
    const createdCards: { id: string }[] = [];
    for (const card of BLACK_VS_WHITE_CARDS) {
      const padded = String(card.number).padStart(3, "0");
      const totalCards = card.number <= 32 ? 32 : 45;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const created = await (prisma.card.create as any)({
        data: {
          number:     card.number,
          name:       card.name,
          character:  card.character,
          race:       card.race,
          planet:     card.planet,
          rarity:     card.rarity,
          collection: COLLECTION,
          isSecret:   card.isSecret,
          imageUrl:   `/cards/${COLLECTION}/${padded}.png`,
          totalCards,
        },
        select: { id: true },
      });
      createdCards.push(created);
    }

    // 4. Donner toutes les cartes à l'admin
    for (const card of createdCards) {
      await prisma.userCard.upsert({
        where: { userId_cardId: { userId: user.id, cardId: card.id } },
        update: {},
        create: { userId: user.id, cardId: card.id, quantity: 1 },
      });
    }

    return NextResponse.json({
      deleted: existingIds.length,
      created: createdCards.length,
      collection: COLLECTION,
    });
  } catch (err) {
    console.error("[POST /api/admin/reset-collection]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
