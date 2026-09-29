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
  const collection = searchParams.get("collection");

  const cards = await prisma.card.findMany({
    where: collection ? { collection } : {},
    orderBy: { number: "asc" },
  });

  const userCards = await prisma.userCard.findMany({
    where: {
      userId: session.user.id,
      cardId: { in: cards.map((c) => c.id) },
    },
    include: { card: true },
  });

  return NextResponse.json(userCards.map((uc) => ({
    cardId: uc.cardId,
    quantity: uc.quantity,
    obtainedAt: uc.obtainedAt,
    ...uc.card,
  })));
}
