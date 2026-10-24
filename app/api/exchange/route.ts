import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET: trade offers involving the current user (sent or received)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const offers = await prisma.tradeOffer.findMany({
    where: {
      OR: [
        { offererId: session.user.id },
        { recipientId: session.user.id },
      ],
      status: { in: ["EN_ATTENTE", "VU"] },
    },
    include: {
      offerer:   { select: { id: true, username: true } },
      recipient: { select: { id: true, username: true } },
      offeredCard:   true,
      requestedCard: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(offers);
}

// POST: create a CARD_FOR_CARD trade offer toward a specific user (by username)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { offeredCardId, requestedCardId, recipientUsername } = await req.json();

  if (!offeredCardId || !recipientUsername) {
    return NextResponse.json({ error: "Données manquantes (carte proposée et destinataire requis)." }, { status: 400 });
  }

  // Verify user owns the offered card
  const userCard = await prisma.userCard.findUnique({
    where: { userId_cardId: { userId: session.user.id, cardId: offeredCardId } },
  });
  if (!userCard || userCard.quantity < 1) {
    return NextResponse.json({ error: "Vous ne possédez pas cette carte." }, { status: 400 });
  }

  // Resolve recipient
  const recipient = await prisma.user.findUnique({
    where: { username: recipientUsername },
    select: { id: true },
  });
  if (!recipient) {
    return NextResponse.json({ error: "Destinataire introuvable." }, { status: 404 });
  }
  if (recipient.id === session.user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas vous envoyer une offre." }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const offer = await prisma.tradeOffer.create({
    data: {
      offererId:       session.user.id,
      offeredCardId,
      requestedCardId: requestedCardId ?? null,
      recipientId:     recipient.id,
      status:          "EN_ATTENTE",
      expiresAt,
    },
    include: {
      offerer:       { select: { id: true, username: true } },
      recipient:     { select: { id: true, username: true } },
      offeredCard:   true,
      requestedCard: true,
    },
  });

  return NextResponse.json(offer, { status: 201 });
}
