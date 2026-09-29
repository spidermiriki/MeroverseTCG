import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET: list all open trade offers
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const offers = await prisma.tradeOffer.findMany({
    where: { status: "OPEN" },
    include: {
      offerer: { select: { id: true, username: true } },
      offeredCard: true,
      requestedCard: true,
      bids: {
        include: { bidder: { select: { id: true, username: true } } },
        orderBy: { amount: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(offers);
}

// POST: create a new trade offer
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { offeredCardId, type, requestedCardId, minimumPrice } = await req.json();

  if (!offeredCardId || !type) {
    return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
  }

  // Verify user owns the card
  const userCard = await prisma.userCard.findUnique({
    where: { userId_cardId: { userId: session.user.id, cardId: offeredCardId } },
  });

  if (!userCard || userCard.quantity < 1) {
    return NextResponse.json({ error: "Vous ne possédez pas cette carte." }, { status: 400 });
  }

  if (type === "CARD_FOR_CARD" && !requestedCardId) {
    return NextResponse.json({ error: "Carte demandée manquante." }, { status: 400 });
  }

  if (type === "AUCTION" && (!minimumPrice || minimumPrice < 1)) {
    return NextResponse.json({ error: "Prix minimum invalide." }, { status: 400 });
  }

  const offer = await prisma.tradeOffer.create({
    data: {
      offererId: session.user.id,
      offeredCardId,
      type,
      requestedCardId: type === "CARD_FOR_CARD" ? requestedCardId : null,
      minimumPrice: type === "AUCTION" ? minimumPrice : null,
      status: "OPEN",
    },
    include: {
      offerer: { select: { id: true, username: true } },
      offeredCard: true,
      requestedCard: true,
    },
  });

  return NextResponse.json(offer, { status: 201 });
}
