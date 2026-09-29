import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Melocoin packages available for purchase
const MELOCOIN_PACKAGES = [
  { id: "small", amount: 100, label: "100 Melocoins", price: "1€" },
  { id: "medium", amount: 300, label: "300 Melocoins", price: "2.50€" },
  { id: "large", amount: 700, label: "700 Melocoins", price: "5€" },
  { id: "xl", amount: 1500, label: "1500 Melocoins", price: "10€" },
];

export async function GET() {
  return NextResponse.json({ packages: MELOCOIN_PACKAGES });
}

// Sell a card for Melocoins
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { cardId } = await req.json();

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) return NextResponse.json({ error: "Carte introuvable." }, { status: 404 });

  const userCard = await prisma.userCard.findUnique({
    where: { userId_cardId: { userId: session.user.id, cardId } },
  });

  if (!userCard || userCard.quantity < 1) {
    return NextResponse.json({ error: "Vous ne possédez pas cette carte." }, { status: 400 });
  }

  // Sell value by rarity
  const sellValues: Record<string, number> = {
    COMMUN: 5,
    RARE: 15,
    EPIQUE: 40,
    MYTHIQUE: 100,
    LEGENDAIRE: 300,
    CHROMATIQUE: 500,
  };

  const sellValue = sellValues[card.rarity] ?? 5;

  await prisma.$transaction(async (tx) => {
    await tx.userCard.update({
      where: { userId_cardId: { userId: session.user.id, cardId } },
      data: { quantity: { decrement: 1 } },
    });
    await tx.user.update({
      where: { id: session.user.id },
      data: { melocoins: { increment: sellValue } },
    });
  });

  return NextResponse.json({ success: true, earned: sellValue });
}
