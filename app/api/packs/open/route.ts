import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rollRarity, canOpenFreePack } from "@/lib/pack-odds";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { packId, isFree } = await req.json();

  const pack = await prisma.pack.findUnique({ where: { id: packId } });
  if (!pack || !pack.isAvailable) {
    return NextResponse.json({ error: "Booster introuvable." }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  if (isFree) {
    if (!canOpenFreePack(user.lastFreePack)) {
      return NextResponse.json({ error: "Votre booster gratuit n'est pas encore disponible." }, { status: 400 });
    }
  } else {
    if (user.melocoins < pack.price) {
      return NextResponse.json({ error: "Melocoins insuffisants." }, { status: 400 });
    }
  }

  // Get all cards in this collection grouped by rarity
  const allCards = await prisma.card.findMany({
    where: { collection: pack.collection },
  });

  if (allCards.length === 0) {
    return NextResponse.json({ error: "Aucune carte disponible dans cette collection." }, { status: 400 });
  }

  const cardsByRarity: Record<string, typeof allCards> = {};
  for (const card of allCards) {
    if (!cardsByRarity[card.rarity]) cardsByRarity[card.rarity] = [];
    cardsByRarity[card.rarity].push(card);
  }

  // Roll cards
  const drawnCards: (typeof allCards)[0][] = [];
  for (let i = 0; i < pack.cardsCount; i++) {
    let rarity = rollRarity();

    // Fallback: if no card exists for that rarity, use COMMUN
    while (!cardsByRarity[rarity] || cardsByRarity[rarity].length === 0) {
      rarity = "COMMUN";
    }

    const rarityCards = cardsByRarity[rarity];
    const card = rarityCards[Math.floor(Math.random() * rarityCards.length)];
    drawnCards.push(card);
  }

  // Update user inventory and melocoins in a transaction
  await prisma.$transaction(async (tx) => {
    // Deduct coins or mark free pack used
    if (isFree) {
      await tx.user.update({
        where: { id: user.id },
        data: { lastFreePack: new Date() },
      });
    } else {
      await tx.user.update({
        where: { id: user.id },
        data: { melocoins: { decrement: pack.price } },
      });
    }

    // Add cards to user's collection
    for (const card of drawnCards) {
      await tx.userCard.upsert({
        where: { userId_cardId: { userId: user.id, cardId: card.id } },
        update: { quantity: { increment: 1 } },
        create: { userId: user.id, cardId: card.id, quantity: 1 },
      });
    }
  });

  return NextResponse.json({ cards: drawnCards });
}
