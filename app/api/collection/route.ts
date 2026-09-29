import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection") ?? "BLACK_VS_WHITE";

  const allCards = await prisma.card.findMany({
    where: { collection },
    orderBy: { number: "asc" },
  });

  const userCards = await prisma.userCard.findMany({
    where: { userId: session.user.id, cardId: { in: allCards.map((c) => c.id) } },
  });

  const ownedCardIds = new Set(userCards.filter((uc) => uc.quantity > 0).map((uc) => uc.cardId));
  const ownedSecretNumbers = allCards
    .filter((c) => c.isSecret && ownedCardIds.has(c.id))
    .map((c) => c.number);

  // Build card visibility list
  const visibleCards = allCards.map((card) => {
    const owned = ownedCardIds.has(card.id);

    if (owned) {
      return { ...card, owned: true, visible: true };
    }

    if (!card.isSecret) {
      return { ...card, owned: false, visible: true };
    }

    // Secret card: visible only if user owns a neighboring secret
    const isNeighborVisible = ownedSecretNumbers.some(
      (n) => Math.abs(n - card.number) <= 5
    );

    return {
      ...card,
      owned: false,
      visible: isNeighborVisible,
    };
  });

  const total = allCards.length;
  const owned = userCards.filter((uc) => uc.quantity > 0).length;

  return NextResponse.json({ cards: visibleCards, stats: { total, owned } });
}
