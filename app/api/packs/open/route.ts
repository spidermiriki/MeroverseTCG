import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rollRarity, getAvailableEnergy, ENERGY_INTERVAL_MS, MAX_ENERGY } from "@/lib/pack-odds";

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
    const actualEnergy = getAvailableEnergy(user.energyCount, user.lastEnergyTick);
    if (actualEnergy === 0) {
      return NextResponse.json({ error: "Aucun booster accumulé pour l'instant." }, { status: 400 });
    }
  } else {
    if (user.coins < pack.price) {
      return NextResponse.json({ error: "Coins insuffisants." }, { status: 400 });
    }
  }

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

  const drawnCards: (typeof allCards)[0][] = [];
  for (let i = 0; i < pack.cardsCount; i++) {
    let rarity = rollRarity();
    while (!cardsByRarity[rarity] || cardsByRarity[rarity].length === 0) {
      rarity = "COMMUN";
    }
    const rarityCards = cardsByRarity[rarity];
    drawnCards.push(rarityCards[Math.floor(Math.random() * rarityCards.length)]);
  }

  await prisma.$transaction(async (tx) => {
    if (isFree) {
      const actualEnergy = getAvailableEnergy(user.energyCount, user.lastEnergyTick);
      const elapsed = Date.now() - user.lastEnergyTick.getTime();
      const regenerated = Math.floor(elapsed / ENERGY_INTERVAL_MS);
      // Store consumed state: spent 1, tick reset to now so next regen starts from here
      const remaining = Math.min(MAX_ENERGY, actualEnergy) - 1;
      await tx.user.update({
        where: { id: user.id },
        data: {
          energyCount: remaining,
          lastEnergyTick: new Date(user.lastEnergyTick.getTime() + regenerated * ENERGY_INTERVAL_MS),
        },
      });
    } else {
      await tx.user.update({
        where: { id: user.id },
        data: { coins: { decrement: pack.price } },
      });
    }

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
